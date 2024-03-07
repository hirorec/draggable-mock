import clsx from 'clsx';
import React, { useRef } from 'react';

import { ColumnProps } from '@/types';

import styles from './index.module.scss';
import { Column } from '../Column';

type Props = {
  columnList: ColumnProps[];
};

export const ColumnContainer: React.FC<Props> = ({ columnList }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={clsx(styles.container)}>
      {columnList.map((column, index) => {
        return <Column key={index} id='' colDiv={column.colDiv} rowDiv={column.rowDiv} label='' />;
      })}
    </div>
  );
};
