import clsx from 'clsx';
import React, { useMemo } from 'react';

import { STEP } from '@/features/BoxApplication/const';
import { ColumnProps } from '@/features/BoxApplication/types';

import styles from './index.module.scss';
import { useBoxApp } from '../../hooks/useBoxApp';
import { colsWidthTotal } from '../../utils';

type Props = {
  columnList: ColumnProps[];
};

export const ColumnRowHeader: React.FC<Props> = ({ columnList }) => {
  const { rowInterval } = useBoxApp();

  const headerStyle = useMemo(() => {
    const width = colsWidthTotal(columnList);
    return { width: `${width}px` };
  }, [columnList]);

  const rowDiv = useMemo(() => {
    if (columnList[0]) {
      return columnList[0].rowDiv;
    }

    return 0;
  }, [columnList]);

  return (
    <div className={clsx(styles.header, `rowInterval--${rowInterval}`)} style={headerStyle}>
      <div className={clsx(styles.headerInner)}>
        {new Array(rowDiv).fill({}).map((_, index) => {
          return <div className={clsx(styles.headerRow)} key={index} style={{ height: `${STEP.Y}px` }}></div>;
        })}
      </div>
    </div>
  );
};
