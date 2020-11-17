import LogLine from './LogLine';
import type { LineBody } from './LogLine';
import type { Feature } from './features';

function isString(target: any): target is string {
  return typeof target === 'string';
}
function isRegexp(target: any): target is RegExp {
  return target instanceof RegExp;
}

export function matchCommand(feature: Feature, lineBody: LineBody): boolean {
  if (isString(feature.command)) {
    return lineBody.command === feature.command;
  }
  if (isRegexp(feature.command)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return feature.command?.test(lineBody.command!);
  }
  return false;
}

export function matchParameter(
  featureParameter: Feature['parameter'],
  lineParameter: LineBody['parameter']
) {
  if (Array.isArray(featureParameter) && Array.isArray(lineParameter)) {
    let count = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const fp of featureParameter) {
      // eslint-disable-next-line no-restricted-syntax
      for (const lp of lineParameter) {
        // fp 匹配条件为文字 直接判断是否相等
        if (isString(fp.key) && isString(fp.value)) {
          if (fp.key === lp.key && fp.value === lp.value) {
            count += 1;
          }
        }
        // key 是正则
        if (isString(fp.key) && isRegexp(fp.value)) {
          if (fp.key === lp.key && fp.value.test(lp.value)) {
            count += 1;
          }
        }
        // key value 皆为正则
        if (isRegexp(fp.key) && isRegexp(fp.value)) {
          if (fp.key.test(lp.key ?? '') && fp.value.test(lp.value)) {
            count += 1;
          }
        }
      }
    }
    if (count === featureParameter.length) {
      return true;
    }
  }
  return false;
}

export function matchChildren(feature: Feature, line: LogLine) {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define,@typescript-eslint/no-non-null-assertion
  const matched = match(feature.children!, line.children!);
  if (matched) {
    return {
      date: line.date,
      state: feature.state,
      line,
      feature,
    };
  }
  return null;
}

export interface MatchResult {
  date: string;
  state: string;
  line: LogLine;
  feature: Feature<any>;
}

export function match(features: Feature[], lines: LogLine[]): MatchResult[] {
  const result = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const feature of features) {
    // eslint-disable-next-line no-restricted-syntax
    for (const line of lines) {
      const {
        state: featureState,
        sequenceType: featureSequenceType,
        level: featureLevel,
        bodyType: featureBodyType,
        parameter: featureParameter,
        children: featureChildren,
      } = feature;
      const {
        date: lineDate,
        sequenceType: lineSequenceType,
        level: lineLevel,
        body: lineBody,
        children: lineChildren,
      } = line;
      if (
        featureSequenceType === lineSequenceType &&
        featureLevel === lineLevel
      ) {
        // sequenceType、level 匹配则进行下一步匹配

        // 匹配带 children 的情况
        if (
          Array.isArray(lineChildren) &&
          Array.isArray(featureChildren) &&
          lineBody?.type === featureBodyType
        ) {
          const childrenResult = matchChildren(feature, line);
          if (childrenResult) result.push(childrenResult);
          continue;
        }

        // 匹配 command
        if (lineBody?.type === 'command' && featureBodyType === 'command') {
          const matched = matchCommand(feature, lineBody);
          if (matched) {
            result.push({
              date: lineDate,
              state: featureState,
              line,
              feature,
            });
            continue;
          }
        }

        // 匹配 parameter
        if (lineBody?.type === 'parameter' && featureBodyType === 'parameter') {
          const matched = matchParameter(featureParameter, lineBody.parameter);
          if (matched) {
            result.push({
              date: lineDate,
              state: featureState,
              line,
              feature,
            });
            continue;
          }
        }

        // 匹配 commandWithParameter
        if (
          lineBody?.type === 'commandWithParameter' &&
          featureBodyType === 'commandWithParameter'
        ) {
          const commandMatched = matchCommand(feature, lineBody);
          const parameterMatched = matchParameter(
            featureParameter,
            lineBody.parameter
          );
          if (commandMatched && parameterMatched) {
            result.push({
              date: lineDate,
              state: featureState,
              line,
              feature,
            });
            continue;
          }
        }

        // 匹配 纯命令 例如：D 13:51:46.3388180 Box.OnDestroy()
        if (
          !line.body &&
          Object.keys(feature).length === 3 &&
          featureState !== undefined &&
          featureSequenceType !== undefined &&
          featureLevel !== undefined
        ) {
          result.push({
            date: lineDate,
            state: featureState,
            line,
            feature,
          });
        }
      }
    }
  }

  return result;
}
