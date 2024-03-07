import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { STEP } from '@/const';
import { BoxProps, Position, Size } from '@/types';

import styles from './index.module.scss';
import { Box } from '../Box';

type Props = {
  boxList: BoxProps[];
  onUpdateBox: (box: BoxProps, index: number) => void;
};

export const BoxContainer: React.FC<Props> = ({ boxList, onUpdateBox }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    console.log({ selectedBoxIndex });
  }, [selectedBoxIndex]);

  const getZIndex = (index: number) => {
    if (index === selectedBoxIndex) {
      return 100;
    } else {
      return 0;
    }
  };

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
          setSelectedBoxIndex(index);
        }
      });
    },
    [containerRef.current, boxList, isMouseDown]
  );

  const handleMouseDown = useCallback(() => {
    setIsMouseDown(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMouseDown(false);
  }, []);

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
            text={box.text}
            backgroundColor={box.backgroundColor}
            borderColor={box.borderColor}
            step={{ x: STEP.X, y: STEP.Y }}
            stepBaseSize={box.size}
            stepBasePosition={box.position}
            zIndex={getZIndex(index)}
            onUpdatePosition={(position: Position) => handleUpdateBoxPosition(index, position)}
            onUpdateSize={(size: Size) => handleUpdateBoxSize(index, size)}
          />
        );
      })}
    </div>
  );
};
