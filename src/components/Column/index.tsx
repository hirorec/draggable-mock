import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import { STEP } from '@/const';

import styles from './index.module.scss';

type Props = {};

export const Column: React.FC<Props> = () => {
  const columnRef = useRef<HTMLDivElement>(null);
  const [columnDiv, setColumnDiv] = useState<number>(0);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [columnRef.current]);

  const borderNods = () => {
    if (columnDiv > 0) {
      return new Array(columnDiv - 1).fill({}).map((_, index) => {
        return <div className={clsx(styles.columnBgBorder)} key={index} style={{ top: `${STEP.Y * (index + 1)}px` }} />;
      });
    }
  };

  const handleResize = () => {
    if (!columnRef.current) {
      return;
    }

    const rect = columnRef.current.getBoundingClientRect();
    const div = Math.floor(rect.height / STEP.Y);
    setColumnDiv(div);
  };

  return (
    <div ref={columnRef} className={clsx(styles.column)}>
      <div className={clsx(styles.columnBg)}>{borderNods()}</div>
    </div>
  );
};
