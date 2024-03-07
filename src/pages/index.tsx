import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { BoxApplication } from '@/components/BoxApplication';
import { BoxContainer } from '@/components/BoxContainer';
import { Column } from '@/components/Column';
import { BoxProps } from '@/types';

import styles from './index.module.scss';

export default function Page() {
  const [boxList, setBoxList] = useState<BoxProps[]>([]);

  useEffect(() => {
    const boxList: BoxProps[] = [
      // {
      //   backgroundColor: '#E6F7DA',
      //   borderColor: '#93ED6F',
      //   text: `Draggable\nBox1`,
      //   position: {
      //     x: 1,
      //     y: 0,
      //   },
      //   size: {
      //     width: 1,
      //     height: 2,
      //   },
      // },
      // {
      //   backgroundColor: '#E6F7DA',
      //   borderColor: '#93ED6F',
      //   text: `Draggable\nBox2`,
      //   position: {
      //     x: 1,
      //     y: 2,
      //   },
      //   size: {
      //     width: 1,
      //     height: 3,
      //   },
      // },
      {
        backgroundColor: '#E6F7DA',
        borderColor: '#93ED6F',
        text: `Draggable\nBox2`,
        position: {
          x: 1,
          y: 5,
        },
        size: {
          width: 1,
          height: 4,
        },
      },
    ];

    setBoxList(boxList);
  }, []);

  const handleUpdateBox = (box: BoxProps, index: number) => {
    const newBoxList = [...boxList];
    newBoxList[index] = box;
    setBoxList(newBoxList);
  };

  return (
    <div className={clsx(styles.container)}>
      <BoxApplication>
        <div className={clsx(styles.columnContainer)}>
          <Column />
          <Column />
          <Column />
          <Column />
          <Column />
        </div>
        <BoxContainer boxList={boxList} onUpdateBox={handleUpdateBox} />
      </BoxApplication>
    </div>
  );
}
