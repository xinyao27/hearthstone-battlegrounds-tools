import LogLine from './LogLine';

export interface Block {
  original: string;
  data: LogLine[];
}

export default class LogBlock implements Block {
  original: string;

  data: LogLine[];

  constructor(content: string) {
    if (!content)
      throw new Error(
        `LogBlock Error: Expected content to be string but got ${content}`
      );
    this.original = content;
    this.data = this.parse(content);
  }

  parse(content: string) {
    return content?.split('\n').reduce<LogLine[]>((acc, cur) => {
      if (cur) {
        const line = new LogLine(cur);
        if (line?.level) {
          this.findParentAndInsertChild(acc, line);
          return acc;
        }
        // 0 级
        return [...acc, line];
      }
      // 兜底
      return acc;
    }, []);
  }

  /**
   * 递归塞入 line
   * 为了避免太多开销 这里直接修改参数
   * @param block
   * @param line
   */
  findParentAndInsertChild(
    block: LogLine[],
    line: LogLine
  ): LogLine[] | undefined {
    const lastOne = block[block.length - 1];
    if (lastOne?.level === line.level - 1 || !lastOne.children) {
      if (!lastOne.children) lastOne.children = [];
      lastOne.children.push(line);
      return undefined;
    }
    return this.findParentAndInsertChild(lastOne.children, line);
  }
}
