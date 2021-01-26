import { getLog, getStateFeature } from './utils'
import LogBlock from '../LogBlock'
import { match } from '../utils'
import { stateFeatures } from '../features'

describe('features', () => {
  describe('TECH_UP', () => {
    const state = 'TECH_UP'
    const logs = getLog(state)
    const allMatched = logs?.map((log) => {
      const block = new LogBlock(log)
      return match(stateFeatures, block.data)?.filter((v) => v.state === state)
    })
    const feature = getStateFeature(state)

    it('should match', () => {
      allMatched?.forEach((matched) => {
        expect(matched.length).toBeGreaterThan(0)
      })
    })

    it('should get result', () => {
      allMatched?.forEach((matched, index) => {
        matched?.forEach((item) => {
          const expectResult = {
            name: '走夜路#51810',
            techLevel: index + 2,
          }
          expect(feature?.getResult?.(item.line)).toEqual(expectResult)
        })
      })
    })
  })

  describe('DAMAGE', () => {
    const state = 'DAMAGE'
    const logs = getLog(state)
    const allMatched = logs?.map((log) => {
      const block = new LogBlock(log)
      return match(stateFeatures, block.data)?.filter((v) => v.state === state)
    })
    const feature = getStateFeature(state)

    it('should match', () => {
      allMatched?.forEach((matched) => {
        expect(matched.length).toBeGreaterThan(0)
      })
    })

    it('should get result', () => {
      const expectResults = [
        {
          attacker: '疯狂金字塔',
          defender: '克尔苏加德',
          attack: 30,
        },
        {
          attacker: '帕奇维克',
          defender: '艾德温·范克里夫',
          attack: 3,
        },
        {
          attacker: '巫妖王',
          defender: '艾德温·范克里夫',
          attack: 3,
        },
        {
          attacker: '艾德温·范克里夫',
          defender: '阿莱克丝塔萨',
          attack: 5,
        },
        {
          attacker: '艾德温·范克里夫',
          defender: '至尊盗王拉法姆',
          attack: 9,
        },
      ]
      allMatched?.forEach((matched, index) => {
        matched?.forEach((item) => {
          const expectResult = expectResults[index]
          expect(feature?.getResult?.(item.line)).toEqual(expectResult)
        })
      })
    })
  })
})
