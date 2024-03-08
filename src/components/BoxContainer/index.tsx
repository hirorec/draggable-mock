import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback, useRef, useState } from 'react';

import { STEP } from '@/const';
import { BoxProps, Position, Size } from '@/types';

import styles from './index.module.scss';
import { Box } from '../Box';

type Props = {
  boxList: BoxProps[];
  maxWidth: number;
  maxHeight: number;
  isMouseDown: boolean;
  onUpdateBox: (box: BoxProps, index: number) => void;
  onDropBox: (box: BoxProps, index: number) => void;
  onUpdateBoxSizeEnd: (box: BoxProps, index: number) => void;
};

export const BoxContainer: React.FC<Props> = ({ boxList, maxWidth, maxHeight, isMouseDown, onUpdateBox, onDropBox, onUpdateBoxSizeEnd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBoxIndex, setHoveredBoxIndex] = useState<number | null>(null);

  const getZIndex = (index: number) => {
    if (index === hoveredBoxIndex) {
      return 100;
    } else {
      return 0;
    }
  };

  const handleUpdateBoxPosition = useCallback(
    (index: number, position: Position) => {
      const newPosition = { ...position };
      const box = _.cloneDeep(boxList[index]);

      if (newPosition.x < 0) {
        newPosition.x = 0;
      }

      if (newPosition.y < 0) {
        newPosition.y = 0;
      }

      if (newPosition.y + box.size.height > maxHeight) {
        newPosition.y = maxHeight - box.size.height;
      }

      if (position.x + box.size.width > maxWidth) {
        newPosition.x = maxWidth - box.size.width;
      }

      if (box) {
        box.position = { ...newPosition };
        onUpdateBox(box, index);
      }
    },
    [boxList, maxWidth, maxHeight]
  );

  const handleUpdateBoxSize = useCallback(
    (index: number, size: Size) => {
      const box = _.cloneDeep(boxList[index]);

      if (box) {
        box.size = size;
        onUpdateBox(box, index);
        // onUpdateBoxSize(box, index);
      }
    },
    [boxList]
  );

  const handleClickBox = (index: number) => {
    // console.log('click', index);
  };

  const handleDropBox = useCallback(
    (index: number, position: Position) => {
      const box = _.cloneDeep(boxList[index]);

      if (box) {
        box.position = position;
        onDropBox(box, index);
      }
    },
    [boxList]
  );

  const handleUpdateBoxSizeEnd = useCallback(
    (index: number, size: Size) => {
      const box = _.cloneDeep(boxList[index]);

      if (box) {
        box.size = size;
        onUpdateBoxSizeEnd(box, index);
      }
    },
    [boxList]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || isMouseDown) {
        return;
      }

      const container: HTMLDivElement = containerRef.current;
      const rect = container.getBoundingClientRect();
      const rectMousePosition: Position = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      };
      const stepBasePosition: Position = {
        x: rectMousePosition.x / STEP.X,
        y: rectMousePosition.y / STEP.Y,
      };

      boxList.forEach((box, index) => {
        const boxPosition: Position = {
          x: box.position.x + box.localPosition.x,
          y: box.position.y + box.localPosition.y,
        };
        const { x, y } = boxPosition;
        const xMax = x + box.size.width;
        const yMax = y + box.size.height;

        if (stepBasePosition.x >= x && stepBasePosition.x <= xMax && stepBasePosition.y >= y && stepBasePosition.y <= yMax) {
          setHoveredBoxIndex(index);
        }
      });
    },
    [containerRef.current, boxList, isMouseDown]
  );

  return (
    <div ref={containerRef} className={clsx(styles.container)} onMouseMove={handleMouseMove}>
      {boxList.map((box, index) => {
        return (
          <Box
            key={index}
            label={box.label}
            backgroundColor={box.backgroundColor}
            borderColor={box.borderColor}
            step={{ x: STEP.X, y: STEP.Y }}
            stepBaseSize={box.size}
            stepBasePosition={box.position}
            localPosition={box.localPosition}
            zIndex={getZIndex(index)}
            isMouseDown={isMouseDown}
            maxHeight={maxHeight}
            onUpdatePosition={(position: Position) => handleUpdateBoxPosition(index, position)}
            onUpdateSize={(size: Size) => handleUpdateBoxSize(index, size)}
            onUpdateSizeEnd={(size: Size) => handleUpdateBoxSizeEnd(index, size)}
            onDrop={(position: Position) => handleDropBox(index, position)}
            onClick={() => handleClickBox(index)}
          />
        );
      })}
    </div>
  );
};
