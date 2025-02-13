import {
  ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState,
} from 'react';

import { createNumberArray, getNumberOrDefault } from '@nf-team/core';
import { useUpdateEffect } from '@nf-team/react';
import dayjs from 'dayjs';

import SelectBox from '@/components/common/SelectBox';

import styles from './index.module.scss';

type DateType = 'year' | 'month' | 'days';

const MONTH_RANGE = 12;

type Props = {
  onBirthChange: (date: string) => void;
  defaultBirthDate: string;
};

function BirthSelectDatePicker({ defaultBirthDate, onBirthChange }: Props) {
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [days, setDays] = useState<string>('');
  const [daysRange, setDaysRange] = useState<number>(0);
  const [monthRange, setMonthRange] = useState<number>(MONTH_RANGE);

  const { nowYear, yearRange } = useMemo(() => ({
    yearRange: dayjs(Date.now()).diff('1981-01-01', 'years') + 1,
    nowYear: dayjs(Date.now()).year(),
  }), []);

  const handleChange = useCallback((type: DateType) => (e: ChangeEvent<HTMLSelectElement>) => {
    const changeBirth: Record<DateType, Dispatch<SetStateAction<string>>> = {
      year: setYear,
      month: setMonth,
      days: setDays,
    };

    changeBirth[type](e.target.value);
  }, []);

  useUpdateEffect(() => {
    if (year && dayjs().year() === dayjs(year).year()) {
      setMonthRange(dayjs().month());
      setMonth((prevMonth) => (Number(prevMonth) > dayjs().month() ? '' : prevMonth));
      return;
    }

    setMonthRange(MONTH_RANGE);
  }, [year]);

  useUpdateEffect(() => {
    if (year && month) {
      const targetDays = dayjs(`${year}-${month}`).daysInMonth();

      setDaysRange(getNumberOrDefault(targetDays));
    }
  }, [month, year]);

  useUpdateEffect(() => {
    const birthDate = `${year}-${month}-${days}`;

    if (year && month && days && dayjs(birthDate).isValid()) {
      onBirthChange(birthDate);
    }
  }, [year, month, days]);

  useEffect(() => {
    const birthDate = dayjs(defaultBirthDate);

    if (birthDate && birthDate.isValid()) {
      setYear(birthDate.year().toString());
      setMonth((birthDate.month() + 1).toString());
      setDays(birthDate.date().toString());
    }
  }, [defaultBirthDate]);

  return (
    <div className={styles.birthSelectDatePickerWrapper}>
      <SelectBox id="year" emptyOption="생년" value={year} onChange={handleChange('year')}>
        {createNumberArray(yearRange).map((number) => {
          const targetYear = nowYear - number;

          return (
            <option key={targetYear} value={targetYear}>{targetYear}</option>
          );
        })}
      </SelectBox>
      <SelectBox id="month" emptyOption="월" value={month} onChange={handleChange('month')}>
        {createNumberArray(monthRange).map((number) => {
          const targetMonth = number + 1;

          return (
            <option key={targetMonth} value={targetMonth}>{targetMonth}</option>
          );
        })}
      </SelectBox>
      <SelectBox id="days" emptyOption="일" value={days} onChange={handleChange('days')} disabled={!year || !month}>
        {createNumberArray(daysRange).map((day) => {
          const targetDays = day + 1;

          return (
            <option key={targetDays} value={targetDays}>{targetDays}</option>
          );
        })}
      </SelectBox>
    </div>
  );
}

export default BirthSelectDatePicker;
