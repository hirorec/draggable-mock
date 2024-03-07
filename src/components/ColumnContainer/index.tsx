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
  // const [rowDiv, setRowDiv] = useState<number>(0);

  // useEffect(() => {
  //   handleResize();
  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [containerRef.current]);

  // const handleResize = () => {
  //   if (!containerRef.current) {
  //     return;
  //   }

  //   const rect = containerRef.current.getBoundingClientRect();
  //   const rowDiv = Math.ceil(rect.height / STEP.Y);
  //   setRowDiv(rowDiv);
  // };

  return (
    <div ref={containerRef} className={clsx(styles.container)}>
      {columnList.map((column, index) => {
        return <Column key={index} id='' rowDiv={column.rowDiv} label='' />;
      })}
    </div>
  );
};
