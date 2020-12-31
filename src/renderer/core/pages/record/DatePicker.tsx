import React from 'react';
import {
  MuiPickersUtilsProvider,
  DatePicker as BaseDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/dayjs';
import { Tooltip } from '@material-ui/core';
import orange from '@material-ui/core/colors/orange';
import dayjs, { Dayjs } from 'dayjs';
import cnLocale from 'dayjs/locale/zh-cn';

import type { RecordItem } from '@core/hooks/useStatistics';
import { makeStyles } from '@material-ui/core/styles';

interface DatePickerProps {
  data: RecordItem[];
  value: Dayjs;
  onChange: (date: Dayjs) => void | React.Dispatch<React.SetStateAction<Date>>;
}

/**
 * 根据当天的战绩数量判断要显示的颜色等级
 * 1~4    => 1
 * 5~8    => 2
 * 9~12   => 3
 * 13~16  => 4
 * 17~20  => 5
 * >20   => 6
 * @param count
 */
function getLevel(count: number) {
  if (count >= 1 && count <= 4) {
    return {
      level: 1,
      color: orange[50],
    };
  }
  if (count >= 5 && count <= 8) {
    return {
      level: 2,
      color: orange[100],
    };
  }
  if (count >= 9 && count <= 12) {
    return {
      level: 3,
      color: orange[300],
    };
  }
  if (count >= 13 && count <= 16) {
    return {
      level: 4,
      color: orange[500],
    };
  }
  if (count >= 17 && count <= 20) {
    return {
      level: 5,
      color: orange[700],
    };
  }
  if (count > 20) {
    return {
      level: 6,
      color: orange[900],
    };
  }
  return {
    level: 0,
    color: 'transparent',
  };
}

const useStyles = makeStyles(() => ({
  root: {},
  block: {
    padding: 2,
    '& button': {
      width: 32,
      height: 32,
    },
  },
}));

const DatePicker: React.FC<DatePickerProps> = ({ data, value, onChange }) => {
  const classes = useStyles();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={cnLocale}>
      <BaseDatePicker
        label="选择日期"
        value={value}
        // @ts-ignore
        onChange={onChange}
        renderDay={(day, _, dayInCurrentMonth, dayComponent) => {
          const date = day!.clone();
          const count = data.filter((v) => dayjs(v.date).isSame(date, 'date'))
            .length;

          if (dayInCurrentMonth) {
            if (count) {
              return (
                <Tooltip title={`${count} 条战绩`} arrow>
                  <div className={classes.block}>
                    <div
                      style={{
                        borderRadius: 4,
                        background: getLevel(count).color,
                      }}
                    >
                      {dayComponent}
                    </div>
                  </div>
                </Tooltip>
              );
            }
            return (
              <div className={classes.block}>
                <div style={{ background: getLevel(count).color }}>
                  {dayComponent}
                </div>
              </div>
            );
          }
          return (
            <div className={classes.block}>
              <div style={{ background: 'transparent' }}>{dayComponent}</div>
            </div>
          );
        }}
        format="YYYY/MM/DD"
        todayLabel="今日"
        cancelLabel="取消"
        okLabel="确定"
        autoOk
        showTodayButton
        allowKeyboardControl={false}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePicker;
