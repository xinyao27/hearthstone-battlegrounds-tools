import LogLine from './LogLine';

interface Block {
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
        const parsedLine = new LogLine(cur);
        if (parsedLine.isChildren) {
          // 如果是子级 与数组最后一项合并
          const lastIndex = acc.length - 1;
          if (lastIndex) {
            const parent = acc[acc.length - 1];
            const children = parent?.body.children ?? [];
            children.push(parsedLine);
            parent.body.children = children;
            acc.splice(lastIndex, 1, parent);
          }
          return acc;
        }
        return [...acc, parsedLine];
      }
      return acc;
    }, []);
  }
}
