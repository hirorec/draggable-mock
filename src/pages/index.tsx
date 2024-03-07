import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { BoxApplication } from '@/components/BoxApplication';
import { BoxProps } from '@/types';

import styles from './index.module.scss';

export default function Page() {
  const [boxList, setBoxList] = useState<BoxProps[]>([]);

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
