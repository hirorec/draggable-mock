import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import { STEP } from '@/const';
import { ColumnProps } from '@/types';

import styles from './index.module.scss';
import { Column } from '../Column';

type Props = {
  columnList: ColumnProps[];
};

export const ColumnContainer: React.FC<Props> = ({ columnList }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnRowDiv, setColumnRowDiv] = useState<number>(0);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef.current]);

  const handleResize = () => {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const div = Math.floor(rect.height / STEP.Y);
    setColumnRowDiv(div);
  };

  return (
    <div ref={containerRef} className={clsx(styles.container)}>
      {columnList.map((column, index) => {
        return <Column key={index} id='' rowDiv={columnRowDiv} label='' />;
      })}
    </div>
  );
};
