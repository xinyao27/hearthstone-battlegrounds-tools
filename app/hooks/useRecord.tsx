import React from 'react';
import ReactDOM from 'react-dom';
import { useDebounceFn } from 'ahooks';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import fs from 'fs';
import path from 'path';

import { records } from '@app/store';
import useConnect from '@app/pages/settings/OBS/useConnect';
import useCommand from '@app/pages/settings/OBS/useCommand';
import useObsText from '@app/pages/settings/OBS/useObsText';
import useObsImage from '@app/pages/settings/OBS/useObsImage';
import { getHero } from '@suspension/utils';
import Text from '@suspension/components/Text';
// @ts-ignore
import crystal from '@suspension/assets/images/crystal.png';

import type { RecordItem } from './useStatistics';

function createImage(result: RecordItem[], dir: string) {
  const dom = document.querySelector('#recordImage');
  const image = (
    <div>
      {result.map((record) => {
        const hero = getHero(record.hero.id);
        if (hero) {
          return (
            <div
              key={record.id}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <img
                style={{ width: 40 }}
                src={hero.battlegrounds.image}
                alt={hero.name}
              />
              <Text
                style={{
                  width: 40,
                  height: 40,
                  background: `url(${crystal}) no-repeat`,
                  backgroundPosition: 'center',
                  textAlign: 'center',
                  lineHeight: '36px',
                  fontSize: 18,
                  marginLeft: 12,
                }}
              >
                {record.rank}
              </Text>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
  if (dom) {
    ReactDOM.render(image, dom);
    html2canvas(dom as HTMLElement, { backgroundColor: null, useCORS: true })
      .then((canvas) => {
        const base64 = canvas
          ?.toDataURL()
          ?.replace(/^data:image\/\w+;base64,/, '');
        const decode = Buffer.from(base64, 'base64');
        fs.writeFileSync(path.resolve(dir, 'hbt-obs.png'), decode);
        return decode;
      })
      .catch(console.log);
  }
}

function useRecord(
  callback?: (result: RecordItem[]) => void
): [
  RecordItem[],
  {
    addRecord: (item: RecordItem) => void;
    deleteRecord: (item: RecordItem) => void;
  }
] {
  const { connected } = useConnect();
  const { run } = useCommand();
  const {
    enable: textEnable,
    currentSource: textCurrentSource,
    max: textMax,
  } = useObsText();
  const {
    enable: imageEnable,
    currentSource: imageCurrentSource,
    dir: imageDir,
    max: imageMax,
  } = useObsImage();
  const [recordList, setRecordList] = React.useState<RecordItem[]>(() =>
    records.get()
  );
  const handleCallback = React.useCallback(
    (result: RecordItem[]) => {
      callback?.(result);

      if (connected) {
        // 只取当天的数据
        const today = dayjs();

        if (textEnable) {
          if (textCurrentSource) {
            const todayResult = result
              .filter((v) => dayjs(v.date).isSame(today, 'day'))
              .slice(0, textMax);
            const text = todayResult
              .map((v) => `${v.hero.name} ${v.rank}`)
              .join('\n');
            run('SetTextGDIPlusProperties', {
              source: textCurrentSource,
              text,
            });
          } else {
            // eslint-disable-next-line no-alert
            alert('OBS: 当前未选择正确的文本来源');
          }
        }
        if (imageEnable) {
          if (imageCurrentSource && imageDir) {
            const todayResult = result
              .filter((v) => dayjs(v.date).isSame(today, 'day'))
              .slice(0, imageMax);
            createImage(todayResult, imageDir);
          } else {
            // eslint-disable-next-line no-alert
            alert('OBS: 当前未选择正确的图片来源或图片储存路径');
          }
        }
      }
    },
    [
      callback,
      connected,
      textEnable,
      imageEnable,
      textCurrentSource,
      textMax,
      run,
      imageCurrentSource,
      imageDir,
      imageMax,
    ]
  );
  const { run: handleAddRecord } = useDebounceFn(
    (item: RecordItem) => {
      setRecordList((previousState) => {
        const result = [item, ...previousState];
        records.set(result);
        handleCallback(result);
        return result;
      });
    },
    {
      wait: 500,
    }
  );
  const handleDeleteRecord = React.useCallback(
    (item: RecordItem) => {
      setRecordList((previousState) => {
        const result = previousState.filter((v) => v.id !== item.id);
        records.set(result);
        handleCallback(result);
        return result;
      });
    },
    [handleCallback]
  );

  return [
    recordList,
    { addRecord: handleAddRecord, deleteRecord: handleDeleteRecord },
  ];
}

export default useRecord;
