import React from 'react';
import ReactDOM from 'react-dom';
import { createModel } from 'hox';
import { useMount, useDebounceFn } from 'ahooks';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import fs from 'fs';
import path from 'path';

import { records } from '@shared/db';
import useConnect from '@core/pages/settings/OBS/useConnect';
import useCommand from '@core/pages/settings/OBS/useCommand';
import useObsText from '@core/pages/settings/OBS/useObsText';
import useObsImage from '@core/pages/settings/OBS/useObsImage';
import { getImageUrl } from '@suspension/utils';
import Text from '@suspension/components/Text';
import useHeroes from '@shared/hooks/useHeroes';

import type { RecordItem } from './useStatistics';

const crystal = require('@shared/assets/images/crystal.png').default;

function useCreateImage() {
  const { getHero } = useHeroes();
  function run(result: RecordItem[], dir: string) {
    const dom = document.createElement('div');
    dom.id = 'recordImage';
    dom.setAttribute('style', 'position: fixed; left: 9999px; top: 9999px');
    document.body.append(dom);
    const image = (
      <div style={{ width: 140, minHeight: 80 }}>
        {result.map((record) => {
          const hero = getHero(record.hero.id);
          if (hero) {
            return (
              <div
                key={record._id}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <img
                  style={{ width: 40 }}
                  src={getImageUrl(hero.id, 'hero')}
                  alt={hero.name}
                />
                <Text
                  style={{
                    width: 40,
                    height: 40,
                    background: `url(${crystal}) no-repeat`,
                    backgroundSize: 'cover',
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
      html2canvas(dom as HTMLElement, {
        width: 140,
        height: 663,
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      })
        .then((canvas) => {
          const base64 = canvas
            ?.toDataURL()
            ?.replace(/^data:image\/\w+;base64,/, '');
          const decode = Buffer.from(base64, 'base64');
          fs.writeFileSync(path.resolve(dir, 'hbt-obs.png'), decode);
          document.body.removeChild(dom);
          return decode;
        })
        // eslint-disable-next-line no-console
        .catch(console.log);
    }
  }

  return run;
}

function useRecord(
  callback?: (result: RecordItem[]) => void
): [
  RecordItem[],
  {
    addRecord: (item: RecordItem) => void;
    deleteRecord: (item: RecordItem) => void;
    editRecord: (item: RecordItem) => void;
    refresh: () => void;
  }
] {
  const { connected } = useConnect();
  const { run } = useCommand();
  const {
    enable: textEnable,
    currentSource: textCurrentSource,
    max: textMax,
  } = useObsText();
  const { enable: imageEnable, dir: imageDir, max: imageMax } = useObsImage();
  const createImage = useCreateImage();
  const [recordList, setRecordList] = React.useState<RecordItem[]>([]);
  useMount(async () => {
    const data = await records.find({});
    setRecordList(data);
  });
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
          if (imageDir) {
            const todayResult = result
              .filter((v) => dayjs(v.date).isSame(today, 'day'))
              .slice(0, imageMax);
            createImage(todayResult, imageDir);
          } else {
            // eslint-disable-next-line no-alert
            alert('OBS: 当前未选择正确的图片储存路径');
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
      imageDir,
      imageMax,
      createImage,
    ]
  );
  const { run: handleAddRecord } = useDebounceFn(
    (item: RecordItem) => {
      records
        .insert(item)
        .then(() => records.find({}))
        .then((result: RecordItem[]) => {
          setRecordList(result);
          return handleCallback(result);
        })
        .catch((err: Error) => {
          throw err;
        });
    },
    {
      wait: 300,
    }
  );
  const handleDeleteRecord = React.useCallback(
    (item: RecordItem) => {
      records
        .remove(item)
        .then(() => records.find({}))
        .then((result: RecordItem[]) => {
          setRecordList(result);
          return handleCallback(result);
        })
        .catch((err: Error) => {
          throw err;
        });
    },
    [handleCallback]
  );
  const handleEditRecord = React.useCallback(
    (item: RecordItem) => {
      records
        .update(item)
        .then(() => records.find({}))
        .then((result: RecordItem[]) => {
          setRecordList(result);
          return handleCallback(result);
        })
        .catch((err: Error) => {
          throw err;
        });
    },
    [handleCallback]
  );
  const handleRefresh = React.useCallback(async () => {
    const data = await records.find({});
    setRecordList(data);
  }, []);

  return [
    recordList,
    {
      addRecord: handleAddRecord,
      deleteRecord: handleDeleteRecord,
      editRecord: handleEditRecord,
      refresh: handleRefresh,
    },
  ];
}

export default createModel(useRecord);
