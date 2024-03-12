import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { ColumnProps } from '@/features/BoxApplication/types';

import styles from './index.module.scss';
import { Arrow } from './parts/Arrow';
import { STEP } from '../../const';
import { useBoxApp } from '../../hooks/useBoxApp';
import { colsWidthTotal } from '../../utils';

type Props = {
  columnList: ColumnProps[];
  isScrollMin: boolean;
  isScrollMax: boolean;
  onScroll: (direction: 1 | -1) => void;
};

export const ColumnHeader: React.FC<Props> = ({ columnList, isScrollMin, isScrollMax, onScroll }) => {
  const colsRef = useRef<HTMLDivElement>(null);
  const { windowWidth, viewportWidth } = useBoxApp();
  const [headerNavStyle, setHeaderNavStyle] = useState<{ width: string }>({ width: '' });

  const getWidth = (index: number) => {
    return columnList[index].colDiv * STEP.X;
  };

  const headerStyle = useMemo(() => {
    const width = colsWidthTotal(columnList);
    return { width: `${width}px` };
  }, [columnList]);

  const headerNavInnerStyle = useMemo(() => {
    const colsW = colsWidthTotal(columnList);
    const width = Math.min(colsW, viewportWidth);
    return { width: `${width}px` };
  }, [columnList, windowWidth, viewportWidth]);

  useEffect(() => {
    if (colsRef.current) {
      const max = colsWidthTotal(columnList);
      const width = Math.min(max, colsRef.current.clientWidth);
      setHeaderNavStyle({ width: `${width}px` });
    }
  }, [colsRef.current, columnList, windowWidth]);

  return (
    <div className={clsx(styles.header)} style={headerStyle}>
      <div className={clsx(styles.headerNav)} style={headerNavStyle}>
        <div className={clsx(styles.headerNavInner)} style={headerNavInnerStyle}>
          {!isScrollMin ? (
            <button className={clsx(styles.navButton, styles.prev)} onClick={() => onScroll(-1)}>
              <Arrow />
            </button>
          ) : (
            <div />
          )}
          {!isScrollMax ? (
            <button className={clsx(styles.navButton, styles.next)} onClick={() => onScroll(1)}>
              <Arrow />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
      <div ref={colsRef} className={clsx(styles.cols)}>
        {columnList.map((column, index) => {
          return (
            <div className={clsx(styles.headerCell)} style={{ width: `${getWidth(index)}px` }} key={index} id={column.id}>
              {column.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
