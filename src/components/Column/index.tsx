import clsx from 'clsx';
import React from 'react';

import { STEP } from '@/const';

import styles from './index.module.scss';

type Props = {
  id: string;
  label: string;
  colDiv: number;
  rowDiv: number;
};

export const Column: React.FC<Props> = ({ id, label, colDiv, rowDiv }) => {
  const borderNods = () => {
    if (rowDiv > 0) {
      return new Array(rowDiv - 1).fill({}).map((_, index) => {
        return <div className={clsx(styles.columnBgBorder)} key={index} style={{ top: `${STEP.Y * (index + 1)}px` }} />;
      });
    }
  };

  return (
    <div className={clsx(styles.column)} style={{ width: `${colDiv * STEP.X}px`, height: `${rowDiv * STEP.Y}px` }}>
      <div className={clsx(styles.columnBg)}>{borderNods()}</div>
    </div>
  );
};
