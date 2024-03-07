import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { BoxApplication } from '@/components/BoxApplication';
import { BoxProps, ColumnProps } from '@/types';

import styles from './index.module.scss';

export default function Page() {
  const [boxList, setBoxList] = useState<BoxProps[]>([]);
  const [columnList, setColumnList] = useState<ColumnProps[]>([]);

  useEffect(() => {
    const boxList: BoxProps[] = [
      // {
      //   id: '1',
      //   backgroundColor: '#FFE4BF',
      //   borderColor: '#F2A455',
      //   text: `Draggable\nBox1`,
      //   position: {
      //     x: 0,
      //     y: 0,
      //   },
      //   size: {
      //     width: 1,
      //     height: 2,
      //   },
      // },
      {
        id: '2',
        backgroundColor: '#E6F7DA',
        borderColor: '#93ED6F',
        label: `Draggable\nBox2`,
        position: {
          x: 2,
          y: 3,
        },
        size: {
          width: 1,
          height: 3,
        },
      },
      {
        id: '3',
        backgroundColor: '#E6F7DA',
        borderColor: '#93ED6F',
        label: `Draggable\nBox3`,
        position: {
          x: 3,
          y: 7,
        },
        size: {
          width: 1,
          height: 4,
        },
      },
    ];
    setBoxList(boxList);
  }, []);

  useEffect(() => {
    const rowDiv = 50;
    const columnList: ColumnProps[] = [
      { id: '1', label: 'column 1', rowDiv },
      { id: '2', label: 'column 2', rowDiv },
      { id: '3', label: 'column 3', rowDiv },
      { id: '4', label: 'column 4', rowDiv },
      { id: '5', label: 'column 5', rowDiv },
    ];
    setColumnList(columnList);
  }, []);

  const handleUpdateBox = (box: BoxProps, index: number) => {
    const newBoxList = [...boxList];
    newBoxList[index] = box;
    setBoxList(newBoxList);
  };

  return (
    <div className={clsx(styles.container)}>
      <BoxApplication boxList={boxList} columnList={columnList} onUpdateBox={handleUpdateBox} />
    </div>
  );
}
