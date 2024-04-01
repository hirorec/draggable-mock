import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { STEP } from '@/features/BoxApplication/const';
import { useBoxApp } from '@/features/BoxApplication/hooks/useBoxApp';

import styles from './index.module.scss';
import { BoxWrapper } from '../BoxWrapper';

import type { BoxProps, ColumnProps, Position } from '@/features/BoxApplication/types';

type Props = {
  boxList: BoxProps[];
  columnList: ColumnProps[];
};

export const BoxContainer: React.FC<Props> = ({ boxList, columnList }) => {
  const { isWindowMouseDown, rowScale, step, setStep } = useBoxApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBoxIndex, setHoveredBoxIndex] = useState<number | null>(null);

  const getZIndex = (index: number) => {
    if (index === hoveredBoxIndex) {
      return 100;
    } else {
      return 0;
    }
  };

  const containerWidth = useMemo(() => {
    return columnList.reduce((prev, current) => {
      return prev + current.colDiv * step.x;
    }, 0);
  }, [columnList, step]);

  useEffect(() => {
    setStep({ x: STEP.X, y: STEP.Y * rowScale });
  }, [rowScale]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || isWindowMouseDown) {
        return;
      }

      const container: HTMLDivElement = containerRef.current;
      const rect = container.getBoundingClientRect();
      const rectMousePosition: Position = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      };
      const stepBasePosition: Position = {
        x: rectMousePosition.x / step.x,
        y: rectMousePosition.y / step.y,
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
    [containerRef.current, boxList, isWindowMouseDown, step]
  );

  return (
    <div ref={containerRef} className={clsx(styles.container)} onMouseMove={handleMouseMove} style={{ width: `${containerWidth}px` }}>
      {boxList.map((box, index) => {
        return (
          <BoxWrapper
            key={index}
            id={box.id}
            label={box.label}
            backgroundColor={box.backgroundColor}
            borderColor={box.borderColor}
            stepBaseSize={box.size}
            stepBasePosition={box.position}
            localPosition={box.localPosition}
            zIndex={getZIndex(index)}
          />
        );
      })}
    </div>
  );
};
