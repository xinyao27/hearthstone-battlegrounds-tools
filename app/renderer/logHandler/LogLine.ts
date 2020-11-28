export interface LineBody {
  type: 'command' | 'parameter' | 'commandWithParameter';
  original: string;
  command?: string;
  parameter?: { key?: string; value: string }[];
}
export interface Line {
  original: string;
  date: string;
  sequenceType: string;
  level: number;
  body: LineBody | null;
  children?: Line[];
}

export default class LogLine implements Line {
  original: string;

  date: string;

  sequenceType: string;

  level: number;

  body: LineBody | null;

  children?: LogLine[];

  constructor(line: string) {
    if (!line)
      throw new Error(
        `LogLine Error: Expected line to be string but got ${line}`
      );
    const { date, sequenceType, level, body } = this.parse(line);
    this.original = line;
    this.date = date;
    this.sequenceType = sequenceType;
    this.level = level;
    this.body = body;
  }

  parse(line: string) {
    const [part1, part2] = line.split('()');
    const [, date, sequenceType] = part1.split(' ');
    let body: LineBody | null;
    if (part2) {
      const [, bodyString] = line.split('() - ');
      body = this.bodyParser(bodyString);
      const childrenReg = /^\s{4}(.*)/;
      const childrenReg2 = /^\s{2}(.*)/;
      if (
        bodyString &&
        (bodyString.match(childrenReg) || bodyString.match(childrenReg2))
      ) {
        // 根据开头的缩进数量 判断嵌套深度（level）
        const length = bodyString.trimEnd().length - bodyString?.trim().length;
        const level = Math.round(length / 4);
        return {
          date,
          sequenceType,
          level,
          body,
        };
      }
      return {
        date,
        sequenceType,
        level: 0,
        body,
      };
    }
    return {
      date,
      sequenceType,
      level: 0,
      body: null,
    };
  }

  bodyParser(body: string): LineBody | null {
    const target = body?.trim();
    if (target) {
      // 分为三种形式 命令 / 命令+参数 / 参数

      // 命令
      // CREATE_GAME
      const commandReg = /^\S+$/;
      const matchCommand = (string: string) =>
        commandReg.test(string) && !string.includes('=');
      if (matchCommand(target)) {
        return {
          type: 'command',
          original: body,
          command: target,
        };
      }
      // 参数
      // tag=CARDTYPE value=GAME
      const parameterReg = /^\S+=\S+/;
      const parameterReg2 = /^(\S+\[\d\]) = (\S+)/;
      const matchParameter = (string: string) =>
        parameterReg.test(string) || parameterReg2.test(string);
      // @ts-ignore
      const getParameter = (string: string) => {
        // 处理以下情况
        // Entity=[entityName=派对元素 id=1703 zone=HAND zonePos=2 cardId=TB_BaconUps_160 player=7]
        if (string.includes('=[')) {
          const regex = /(\S+)=(\[.*\])(.*)$/;
          const matched = string.match(regex);
          if (matched) {
            return [
              {
                key: matched[1],
                value: matched[2],
              },
              ...(matched[3] ? getParameter(matched[3].trim()) : []),
            ];
          }
          return [];
        }
        const match2 = string.match(parameterReg2);
        if (match2) {
          return [
            {
              key: match2[1],
              value: match2[2],
            },
          ];
        }
        return string.split(' ').map((item) => {
          const [key, value] = item.split('=');
          return {
            key,
            value,
          };
        });
      };
      if (matchParameter(target)) {
        return {
          type: 'parameter',
          original: body,
          parameter: getParameter(target),
        };
      }
      // 命令+参数
      // GameEntity EntityID=22
      const matchCommandWithParameter = (string: string) => {
        // 处理以下情况
        // FULL_ENTITY - Updating [entityName=巴罗夫领主 id=146 zone=SETASIDE zonePos=0 cardId=TB_BaconShop_HERO_72 player=11] CardID=TB_BaconShop_HERO_72
        if (string.includes(' - Updating ')) {
          const [p1, ...args] = string.split(' - Updating ');
          return matchCommand(p1) && matchParameter(args.join(' '));
        }
        const [p1, ...args] = string.split(' ');
        return matchCommand(p1) && matchParameter(args.join(' '));
      };
      if (matchCommandWithParameter(target)) {
        if (target.includes(' - Updating ')) {
          const [p1, ...args] = target
            .replace('[', '')
            .replace(']', '')
            .split(' - Updating ');
          return {
            type: 'commandWithParameter',
            original: body,
            command: p1,
            parameter: getParameter(args.join(' ')),
          };
        }
        const [p1, ...args] = target.split(' ');
        return {
          type: 'commandWithParameter',
          original: body,
          command: p1,
          parameter: getParameter(args.join(' ')),
        };
      }
    }
    return null;
  }
}
