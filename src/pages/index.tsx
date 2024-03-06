import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import { BoxContainer } from '@/components/BoxContainer';
import { ResizableBoxContainer } from '@/components/ResizableBoxContainer';
import { STEP } from '@/const';

import styles from './index.module.scss';

export default function Page() {
  const columnRef = useRef<HTMLDivElement>(null);
  const [columnDiv, setColumnDiv] = useState<number>(0);

  const handleResize = () => {
    if (!columnRef.current) {
      return;
    }

    const rect = columnRef.current.getBoundingClientRect();
    const div = Math.floor(rect.height / STEP.Y);
    setColumnDiv(div);
  };

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

  return (
    <div className={clsx(styles.container)}>
      <div ref={columnRef} className={clsx(styles.column)}>
        <ResizableBoxContainer width={200} step={STEP.Y} />
      </div>
      <div ref={columnRef} className={clsx(styles.column)}>
        <div className={clsx(styles.columnBg)}>{borderNods()}</div>
        <BoxContainer width={200} step={STEP.Y} />
      </div>
      <div ref={columnRef} className={clsx(styles.column)}>
        <div className={clsx(styles.columnBg)}>{borderNods()}</div>
      </div>
      <div ref={columnRef} className={clsx(styles.column)}>
        <div className={clsx(styles.columnBg)}>{borderNods()}</div>
      </div>
    </div>
  );
}
