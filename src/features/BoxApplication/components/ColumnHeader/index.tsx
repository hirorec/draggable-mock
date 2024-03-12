import clsx from 'clsx';
import React from 'react';

import { ColumnProps } from '@/features/BoxApplication/types';

import styles from './index.module.scss';
import { STEP } from '../../const';

type Props = {
  columnList: ColumnProps[];
};

export const ColumnHeader: React.FC<Props> = ({ columnList }) => {
  const getWidth = (index: number) => {
    return columnList[index].colDiv * STEP.X;
  };

  return (
    <div className={clsx(styles.header)}>
      <div className={clsx(styles.headerNav)}></div>
      {columnList.map((column, index) => {
        return (
          <div className={clsx(styles.headerCell)} style={{ width: `${getWidth(index)}px` }} key={index} id={column.id}>
            {column.label}
          </div>
        );
      })}
    </div>
  );
};
