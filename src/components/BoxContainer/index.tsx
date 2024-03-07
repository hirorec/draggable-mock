import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback, useRef, useState } from 'react';

import { STEP } from '@/const';
import { BoxProps, Position, Size } from '@/types';
import { overlapBox } from '@/utils';

import styles from './index.module.scss';
import { Box } from '../Box';

type Props = {
  boxList: BoxProps[];
  maxHeight: number;
  onUpdateBox: (box: BoxProps, index: number) => void;
  onOverlapBox: (box: BoxProps) => void;
};

export const BoxContainer: React.FC<Props> = ({ boxList, maxHeight, onUpdateBox, onOverlapBox }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBoxIndex, setHoveredBoxIndex] = useState<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const getZIndex = (index: number) => {
    if (index === hoveredBoxIndex) {
      return 100;
    } else {
      return 0;
    }
  };

  const handleUpdateBoxPosition = useCallback(
    (index: number, position: Position) => {
      if (position.x < 0 || position.y < 0) {
        return;
      }

      const box = _.cloneDeep(boxList[index]);

      if (position.y + box.size.height > maxHeight) {
        return;
      }

      if (box) {
        box.position = position;
        onUpdateBox(box, index);
      }
    },
    [boxList, maxHeight]
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
        const { x, y } = box.position;
        const xMax = x + box.size.width;
        const yMax = y + box.size.height;

        if (stepBasePosition.x >= x && stepBasePosition.x <= xMax && stepBasePosition.y >= y && stepBasePosition.y <= yMax) {
          setHoveredBoxIndex(index);
        }
      });
    },
    [containerRef.current, boxList, isMouseDown]
  );

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleClickBox = (index: number) => {
    // console.log('click', index);
  };

  const handleDropBox = useCallback(
    (index: number, position: Position) => {
      const droppedBox: BoxProps = _.cloneDeep(boxList[index]);
      droppedBox.position = { ...position };

      boxList.forEach((box) => {
        if (box.id !== droppedBox.id) {
          const isOverlap = overlapBox(droppedBox, box);

          if (isOverlap) {
            onOverlapBox(droppedBox);
          }
        }
      });
    },
    [boxList]
  );

  return (
    <div
      ref={containerRef}
      className={clsx(styles.container)}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
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
            zIndex={getZIndex(index)}
            onUpdatePosition={(position: Position) => handleUpdateBoxPosition(index, position)}
            onUpdateSize={(size: Size) => handleUpdateBoxSize(index, size)}
            onDrop={(position: Position) => handleDropBox(index, position)}
            onClick={() => handleClickBox(index)}
          />
        );
      })}
    </div>
  );
};
