export interface LineBody {
  type: 'command' | 'parameter' | 'commandWithParameter'
  original: string
  command?: string
  parameter?: { key?: string; value: string }[]
}
export interface Line {
  original: string
  date: string
  sequenceType: string
  level: number
  body: LineBody | null
  children?: Line[]
}

export default class LogLine implements Line {
  original: string

  date: string

  sequenceType: string

  level: number

  body: LineBody | null

  children?: LogLine[]

  // CREATE_GAME
  private commandRegex1 = /^\S+$/

  // option 0 / target 0
  private commandRegex2 = /^(option|target) (\d+)$/

  // zone=PLAY
  private parameterRegex1 = /^\S+=\S+/

  // A = xxx
  private parameterRegex2 = /^(\S+\[\d\]) = (\S+)/

  constructor(line: string) {
    if (!line)
      throw new Error(
        `LogLine Error: Expected line to be string but got ${line}`
      )
    const { date, sequenceType, level, body } = this.parse(line)
    this.original = line
    this.date = date
    this.sequenceType = sequenceType
    this.level = level
    this.body = body
  }

  parse(line: string) {
    const [part1, part2] = line.split('()')
    const [, date, sequenceType] = part1.split(' ')
    let body: LineBody | null
    if (part2) {
      const [, bodyString] = line.split('() - ')
      body = this.bodyParser(bodyString)
      const childrenReg = /^\s{4}(.*)/
      const childrenReg2 = /^\s{2}(.*)/
      if (
        bodyString &&
        (bodyString.match(childrenReg) || bodyString.match(childrenReg2))
      ) {
        // 根据开头的缩进数量 判断嵌套深度（level）
        const length = bodyString.trimEnd().length - bodyString?.trim().length
        const level = Math.round(length / 4)
        return {
          date,
          sequenceType,
          level,
          body,
        }
      }
      return {
        date,
        sequenceType,
        level: 0,
        body,
      }
    }
    return {
      date,
      sequenceType,
      level: 0,
      body: null,
    }
  }

  private matchCommand(string: string) {
    return (
      (this.commandRegex1.test(string) && !string.includes('=')) ||
      this.commandRegex2.test(string)
    )
  }

  private matchParameter(string: string) {
    return (
      this.parameterRegex1.test(string) || this.parameterRegex2.test(string)
    )
  }

  private matchCommandWithParameter(string: string) {
    // 处理以下情况
    // FULL_ENTITY - Updating [entityName=巴罗夫领主 id=146 zone=SETASIDE zonePos=0 cardId=TB_BaconShop_HERO_72 player=11] CardID=TB_BaconShop_HERO_72
    if (string.includes(' - Updating ')) {
      const [command, ...args] = string.split(' - Updating ')
      return {
        matched:
          this.matchCommand(command) && this.matchParameter(args.join(' ')),
        command,
        args: args.map((v) => v.replace(/\[|\]/g, '')),
      }
    }

    // option 0 / target 0
    const reg1 = /^(option|target) (\d+) (.*)$/
    const matched = string.match(reg1)
    if (matched) {
      const baseCommand = matched[1]
      const baseCommandIndex = matched[2]
      const args = matched[3].split(' ')
      const command = `${baseCommand} ${baseCommandIndex}`
      return {
        matched:
          this.matchCommand(command) && this.matchParameter(args.join(' ')),
        command,
        args,
      }
    }

    // default
    const [command, ...args] = string.split(' ')
    return {
      matched:
        this.matchCommand(command) && this.matchParameter(args.join(' ')),
      command,
      args,
    }
  }

  private getParameter(string: string): { key: string; value: string }[] {
    // 处理以下情况
    // Entity=[entityName=派对元素 id=1703 zone=HAND zonePos=2 cardId=TB_BaconUps_160 player=7]
    // Entities[1]=[entityName=林地守护者欧穆 id=86 zone=HAND zonePos=2 cardId=TB_BaconShop_HERO_74 player=5]
    if (string.includes('=[')) {
      const regex = /\[(.*?)\]/g
      const replaceValue = '$hbt_replace$'
      const originalValues: string[] = []
      const simplifiedString = string.replace(regex, (originalValue) => {
        originalValues.push(originalValue)
        return replaceValue
      })
      return simplifiedString.split(' ').map((item) => {
        const [key, value] = item.split('=')
        return {
          key: key?.includes(replaceValue)
            ? key.replace(replaceValue, <string>originalValues.shift())
            : key,
          value: value?.includes(replaceValue)
            ? value.replace(replaceValue, <string>originalValues.shift())
            : value,
        }
      })
    }

    const matched = string.match(this.parameterRegex2)
    if (matched) {
      return [
        {
          key: matched[1],
          value: matched[2],
        },
      ]
    }

    return string.split(' ').map((item) => {
      const [key, value] = item.split('=')
      return {
        key,
        value,
      }
    })
  }

  bodyParser(body: string): LineBody | null {
    const target = body?.trim()
    if (target) {
      // 分为三种形式 命令 / 命令+参数 / 参数

      // 命令
      if (this.matchCommand(target)) {
        return {
          type: 'command',
          original: body,
          command: target,
        }
      }

      // 参数
      // tag=CARDTYPE value=GAME
      if (this.matchParameter(target)) {
        return {
          type: 'parameter',
          original: body,
          parameter: this.getParameter(target),
        }
      }

      // 命令+参数
      // GameEntity EntityID=22
      const { matched, command, args } = this.matchCommandWithParameter(target)
      if (matched) {
        return {
          type: 'commandWithParameter',
          original: body,
          command,
          parameter: this.getParameter(args.join(' ')),
        }
      }
    }
    return null
  }
}
