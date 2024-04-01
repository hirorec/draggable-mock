import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';

import { ColumnProps } from '@/features/BoxApplication/types';

import styles from './index.module.scss';
import { useBoxApp } from '../../hooks/useBoxApp';
import { Column } from '../Column';

type Props = {
  columnList: ColumnProps[];
  children: React.ReactNode;
};

export const ColumnContainer: React.FC<Props> = ({ columnList, children }) => {
  const { setColumnContainerElement } = useBoxApp();
  const columnContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColumnContainerElement(columnContainerRef.current);
  }, [columnContainerRef]);

  return (
    <div ref={columnContainerRef} className={clsx(styles.container)}>
      <div className={clsx(styles.cols)}>
        {columnList.map((column, index) => {
          return <Column key={index} id={column.id} colDiv={column.colDiv} rowDiv={column.rowDiv} label='' />;
        })}
        {children}
      </div>
    </div>
  );
};
