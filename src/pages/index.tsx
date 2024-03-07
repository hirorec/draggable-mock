import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { BoxApplication } from '@/components/BoxApplication';
import { BoxProps } from '@/types';

import styles from './index.module.scss';

export default function Page() {
  const [boxList, setBoxList] = useState<BoxProps[]>([]);

  useEffect(() => {
    const boxList: BoxProps[] = [
      {
        backgroundColor: '#FFE4BF',
        borderColor: '#F2A455',
        text: `Draggable\nBox1`,
        position: {
          x: 1,
          y: 0,
        },
        size: {
          width: 1,
          height: 2,
        },
      },
      {
        backgroundColor: '#E6F7DA',
        borderColor: '#93ED6F',
        text: `Draggable\nBox2`,
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
        backgroundColor: '#E6F7DA',
        borderColor: '#93ED6F',
        text: `Draggable\nBox3`,
        position: {
          x: 2,
          y: 6,
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
      <BoxApplication boxList={boxList} onUpdateBox={handleUpdateBox} />
    </div>
  );
}
