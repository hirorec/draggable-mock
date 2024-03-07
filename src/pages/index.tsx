import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { Box } from '@/components/Box';
import { BoxApplication } from '@/components/BoxApplication';
import { BoxContainer } from '@/components/BoxContainer';
import { Column } from '@/components/Column';
import { STEP } from '@/const';
import { BoxProps, Position, Size } from '@/types';

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

  const handleUpdateBoxPosition = useCallback(
    (index: number, position: Position) => {
      const newBoxList = _.cloneDeep(boxList);
      const box = { ...newBoxList[index] };

      if (box) {
        box.position = position;
        newBoxList[index] = box;
      }

      setBoxList(newBoxList);
    },
    [boxList]
  );

  const handleUpdateBoxSize = useCallback(
    (index: number, size: Size) => {
      const newBoxList = _.cloneDeep(boxList);
      const box = { ...newBoxList[index] };

      if (box) {
        box.size = size;
        newBoxList[index] = box;
      }

      setBoxList(newBoxList);
    },
    [boxList]
  );

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
        <BoxContainer>
          {boxList.map((box, index) => {
            return (
              <Box
                key={index}
                text={box.text}
                backgroundColor={box.backgroundColor}
                borderColor={box.borderColor}
                step={{ x: STEP.X, y: STEP.Y }}
                stepBaseSize={box.size}
                stepBasePosition={box.position}
                onUpdatePosition={(position: Position) => handleUpdateBoxPosition(index, position)}
                onUpdateSize={(size: Size) => handleUpdateBoxSize(index, size)}
              />
            );
          })}
        </BoxContainer>
      </BoxApplication>
    </div>
  );
}
