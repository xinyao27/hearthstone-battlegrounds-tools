import { getLog, getStateFeature } from './utils';
import LogBlock from '../LogBlock';
import { match } from '../utils';
import { stateFeatures } from '../features';

describe('features', () => {
  describe('TECH_UP', () => {
    const state = 'TECH_UP';
    const logs = getLog(state);
    const allMatched = logs?.map((log) => {
      const block = new LogBlock(log);
      return match(stateFeatures, block.data)?.filter((v) => v.state === state);
    });
    const feature = getStateFeature(state);

    it('should match', () => {
      allMatched?.forEach((matched) => {
        expect(matched.length).toBeGreaterThan(0);
      });
    });

    it('should get result', () => {
      allMatched?.forEach((matched, index) => {
        matched?.forEach((item) => {
          const expectResult = {
            name: '走夜路#51810',
            techLevel: index + 2,
          };
          expect(feature?.getResult?.(item.line)).toEqual(expectResult);
        });
      });
    });
  });
});
