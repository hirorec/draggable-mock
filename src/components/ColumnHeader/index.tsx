import clsx from 'clsx';
import React from 'react';

import { ColumnProps } from '@/types';

import styles from './index.module.scss';

type Props = {
  columnList: ColumnProps[];
};

export const ColumnHeader: React.FC<Props> = ({ columnList }) => {
  const getWidth = (index: number) => {
    return columnList[index].colDiv * 150;
  };

  return (
    <div className={clsx(styles.header)}>
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
