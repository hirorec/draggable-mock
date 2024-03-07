import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback } from 'react';

import { STEP } from '@/const';
import { BoxProps, Position, Size } from '@/types';

import styles from './index.module.scss';
import { Box } from '../Box';

type Props = {
  boxList: BoxProps[];
  onUpdateBox: (box: BoxProps, index: number) => void;
};

export const BoxContainer: React.FC<Props> = ({ boxList, onUpdateBox }) => {
  const handleUpdateBoxPosition = useCallback(
    (index: number, position: Position) => {
      const box = _.cloneDeep(boxList[index]);

      if (box) {
        box.position = position;
        onUpdateBox(box, index);
      }
    },
    [boxList]
  );

  const handleUpdateBoxSize = useCallback(
    (index: number, size: Size) => {
      const box = _.cloneDeep(boxList[index]);

      if (box) {
        box.size = size;
        onUpdateBox(box, index);
      }
    },
    [boxList]
  );

  return (
    <div className={clsx(styles.container)}>
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
    </div>
  );
};
