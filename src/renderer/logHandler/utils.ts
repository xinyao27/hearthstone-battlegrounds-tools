import LogLine from './LogLine'
import type { Feature } from './features'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isString(target: any): target is string {
  return typeof target === 'string'
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRegexp(target: any): target is RegExp {
  return target instanceof RegExp
}

export function matchChildren(
  featureChildren: Feature['children'],
  lineChildren: LogLine['children']
): boolean {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define,@typescript-eslint/no-non-null-assertion
  const matched = match(featureChildren!, lineChildren!)
  return !!matched.length && matched.length >= (featureChildren?.length ?? 1)
}

export function matchCommand(feature: Feature, line: LogLine): boolean {
  let result = false
  if (isString(feature.command)) {
    result = line.body?.command === feature.command
    if (Array.isArray(line.children) && Array.isArray(feature.children)) {
      const childrenResult = matchChildren(feature.children, line.children)
      return childrenResult && result
    }
    return result
  }
  if (isRegexp(feature.command)) {
    result = feature.command?.test(line.body?.command ?? '')
    if (Array.isArray(feature.children)) {
      if (Array.isArray(line.children)) {
        const childrenResult = matchChildren(feature.children, line.children)
        return childrenResult && result
      }
      return false
    }
    return result
  }
  return false
}

export function matchParameter(feature: Feature, line: LogLine): boolean {
  const featureParameter = feature.parameter
  const lineParameter = line.body?.parameter
  if (Array.isArray(featureParameter) && Array.isArray(lineParameter)) {
    let count = 0
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const fpIndex in featureParameter) {
      const fp = featureParameter[fpIndex]
      const lp = lineParameter[fpIndex]
      if (fp && lp) {
        // fp 匹配条件为文字 直接判断是否相等
        if (isString(fp.key) && isString(fp.value)) {
          if (fp.key === lp.key && fp.value === lp.value) {
            count += 1
          }
          continue
        }
        // key 是正则
        if (isString(fp.key) && isRegexp(fp.value)) {
          if (fp.key === lp.key && fp.value.test(lp.value)) {
            count += 1
          }
          continue
        }
        // key value 皆为正则
        if (isRegexp(fp.key) && isRegexp(fp.value)) {
          if (fp.key.test(lp.key ?? '') && fp.value.test(lp.value)) {
            count += 1
          }
        }
      }
    }
    if (count === featureParameter.length) {
      if (Array.isArray(feature.children)) {
        if (Array.isArray(line.children)) {
          return matchChildren(feature.children, line.children)
        }
        return false
      }
      return true
    }
  }
  return false
}

export interface MatchResult<S = string> {
  date: string
  state: S
  line: LogLine
  feature: Feature<S>
}

export function match(features: Feature[], lines: LogLine[]): MatchResult[] {
  const result = []

  // eslint-disable-next-line no-restricted-syntax
  for (const feature of features) {
    // eslint-disable-next-line no-restricted-syntax
    for (const line of lines) {
      const {
        state: featureState,
        sequenceType: featureSequenceType,
        level: featureLevel,
        bodyType: featureBodyType,
        children: featureChildren,
      } = feature
      const {
        date: lineDate,
        sequenceType: lineSequenceType,
        level: lineLevel,
        body: lineBody,
        children: lineChildren,
      } = line
      if (
        featureSequenceType === lineSequenceType &&
        featureLevel === lineLevel
      ) {
        // sequenceType、level 匹配则进行下一步匹配

        // 匹配 command
        if (lineBody?.type === 'command' && featureBodyType === 'command') {
          const matched = matchCommand(feature, line)
          if (matched) {
            result.push({
              date: lineDate,
              state: featureState,
              line,
              feature,
            })
            continue
          }
        }

        // 匹配 parameter
        if (lineBody?.type === 'parameter' && featureBodyType === 'parameter') {
          const matched = matchParameter(feature, line)
          if (matched) {
            result.push({
              date: lineDate,
              state: featureState,
              line,
              feature,
            })
            continue
          }
        }

        // 匹配 commandWithParameter
        if (
          lineBody?.type === 'commandWithParameter' &&
          featureBodyType === 'commandWithParameter'
        ) {
          const commandMatched = matchCommand(feature, line)
          const parameterMatched = matchParameter(feature, line)
          if (commandMatched && parameterMatched) {
            result.push({
              date: lineDate,
              state: featureState,
              line,
              feature,
            })
            continue
          }
        }

        // 匹配仅带 children 的情况
        if (
          Array.isArray(lineChildren) &&
          Array.isArray(featureChildren) &&
          lineBody?.type === featureBodyType &&
          !featureBodyType &&
          !feature.command &&
          !feature.parameter
        ) {
          const matched = matchChildren(feature.children, line.children)
          if (matched)
            result.push({
              date: lineDate,
              state: featureState,
              line,
              feature,
            })
          continue
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
          })
        }
      }
    }
  }

  return result
}
