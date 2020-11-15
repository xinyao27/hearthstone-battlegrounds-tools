interface LineBody {
  original: string;
  type?: 'command' | 'parameter';
  value?: string;
  parameter?: { type: string; key?: string; value: string }[];
  children?: Line[];
}
interface Line {
  original: string;
  date: string;
  sequenceType: string;
  isChildren?: boolean;
  body: LineBody;
}

export default class LogLine implements Line {
  original: string;

  date: string;

  sequenceType: string;

  isChildren?: boolean;

  body: LineBody;

  constructor(line: string) {
    if (!line)
      throw new Error(
        `LogLine Error: Expected line to be string but got ${line}`
      );
    const { date, sequenceType, isChildren, body } = this.parse(line);
    this.original = line;
    this.date = date;
    this.sequenceType = sequenceType;
    this.isChildren = isChildren;
    this.body = body;
  }

  parse(line: string) {
    const [types, bodyString] = line.split('() - ');
    const [, date, sequenceType] = types.split(' ');
    const body = this.bodyParser(bodyString);

    const childrenReg = /^\s{4}.*/;
    if (bodyString && bodyString.match(childrenReg)) {
      const isChildren = true;
      return {
        date,
        sequenceType,
        isChildren,
        body,
      };
    }
    return {
      date,
      sequenceType,
      body,
    };
  }

  bodyParser(body: string) {
    // const blockTitleRegex = /(\S+) - (\S+) \[(.*)\] (.*)/;
    // const blockTitle = body.match(blockTitleRegex);
    // if (blockTitle) {
    //   const [
    //     original,
    //     command,
    //     action,
    //     parameters,
    //     additionalParameters,
    //   ] = blockTitle;
    //   const result = {
    //     command,
    //     action,
    //     parameters: this.bodyParser(parameters),
    //     additionalParameters: this.bodyParser(additionalParameters),
    //   };
    // }

    const parameters = body.trim().split(' ');
    return parameters.reduce<LineBody>(
      (acc, cur) => {
        // 命令
        if (cur === cur.toUpperCase() && cur.search('=') < 0 && cur !== '-') {
          return {
            ...acc,
            type: 'command',
            value: cur,
          };
        }
        // 参数
        const [key, value] = cur.split('=');
        const parameter = acc.parameter || [];
        parameter.push({
          type: 'parameter',
          key,
          value,
        });
        return {
          ...acc,
          parameter,
        };
      },
      {
        original: body,
      }
    );
  }
}
