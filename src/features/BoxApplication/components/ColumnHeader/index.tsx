import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { ColumnProps } from '@/features/BoxApplication/types';

import styles from './index.module.scss';
import { Arrow } from './parts/Arrow';
import { STEP } from '../../const';

type Props = {
  columnList: ColumnProps[];
  onScroll: (direction: 1 | -1) => void;
};

export const ColumnHeader: React.FC<Props> = ({ columnList, onScroll }) => {
  const colsRef = useRef<HTMLDivElement>(null);
  const [headerNavStyle, setHeaderNavStyle] = useState<{ width: string }>({ width: '' });
  const [windowWidth, setWindowWidth] = useState(0);

  const getWidth = (index: number) => {
    return columnList[index].colDiv * STEP.X;
  };

  const colsWidth = () => {
    const width = columnList.reduce((prev, next) => {
      return prev + next.colDiv * STEP.X;
    }, 0);
    return width;
  };

  const headerStyle = useMemo(() => {
    const width = colsWidth();
    return { width: `${width}px` };
  }, [columnList]);

  const headerNavInnerStyle = useMemo(() => {
    const colsW = colsWidth();
    const viewportWidth = windowWidth - 40 - 65;
    const width = Math.min(colsW, viewportWidth);
    return { width: `${width}px` };
  }, [columnList, windowWidth]);

  useEffect(() => {
    const onWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', onWindowResize);
    onWindowResize();

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  useEffect(() => {
    if (colsRef.current) {
      const max = colsWidth();
      const width = Math.min(max, colsRef.current.clientWidth);
      setHeaderNavStyle({ width: `${width}px` });
    }
  }, [colsRef.current, columnList, windowWidth]);

  return (
    <div className={clsx(styles.header)} style={headerStyle}>
      <div className={clsx(styles.headerNav)} style={headerNavStyle}>
        <div className={clsx(styles.headerNavInner)} style={headerNavInnerStyle}>
          <button className={clsx(styles.navButton, styles.prev)} onClick={() => onScroll(-1)}>
            <Arrow />
          </button>
          <button className={clsx(styles.navButton, styles.next)} onClick={() => onScroll(1)}>
            <Arrow />
          </button>
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
