import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DraggableBox } from '@/components/DraggableBox';
import { ResizableBox } from '@/components/ResizableBox';
import { STEP } from '@/const';
import { Position, Size, Step } from '@/types';

import styles from './index.module.scss';
import { BoxOverlay } from '../BoxOverlay';

type Props = {
  stepBasePosition: Position;
  stepBaseSize: Size;
  onUpdatePosition: (position: Position) => void;
  onUpdateSize: (size: Size) => void;
  step: Step;
};

export const BoxContainer: React.FC<Props> = ({ step, stepBaseSize, stepBasePosition, onUpdatePosition, onUpdateSize }) => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayBoxHeight, setOverlayBoxHeight] = useState(step.y * 4);
  const [overlayPosition, setOverlayPosition] = useState<Position>({
    x: stepBasePosition.x * step.x,
    y: stepBasePosition.y * step.y,
  });
  const [resizeMode, setResizeMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const boxSize: Size = useMemo(() => {
    return {
      width: stepBaseSize.width * STEP.X,
      height: stepBaseSize.height * STEP.Y,
    };
  }, [stepBaseSize]);

  useEffect(() => {
    if (isDragging || resizeMode) {
      setOverlayBoxHeight(boxSize.height);
      setOverlayVisible(true);
    } else {
      setOverlayVisible(false);
    }
  }, [isDragging, resizeMode, boxSize]);

  const handleResizeBox = useCallback(
    (direction: boolean) => {
      const newBoxSize: Size = { ...stepBaseSize };

      if (direction) {
        newBoxSize.height = stepBaseSize.height + 1;
      } else {
        newBoxSize.height = stepBaseSize.height - 1;
      }

      if (newBoxSize.height <= 1) {
        newBoxSize.height = 1;
      }

      onUpdateSize(newBoxSize);
    },
    [stepBaseSize]
  );

  const handleUpdateResizeMode = (resizeMode: boolean) => {
    setResizeMode(resizeMode);
  };

  const handleUpdateDragging = (isDragging: boolean) => {
    setIsDragging(isDragging);
  };

  const handleDragEnd = (stepBasePosition: Position) => {
    const position = {
      x: stepBasePosition.x * STEP.X,
      y: stepBasePosition.y * STEP.Y,
    };
    setOverlayPosition(position);
  };

  return (
    <div className={clsx(styles.container)}>
      {overlayVisible && (
        <BoxOverlay
          width={boxSize.width}
          height={overlayBoxHeight}
          position={overlayPosition}
          backgroundColor='#E6F7DA'
          borderColor='#93ED6F'
          text={`Draggable\nBox`}
        />
      )}

      <DraggableBox
        width={boxSize.width}
        height={boxSize.height}
        step={step}
        stepBasePosition={stepBasePosition}
        resizeMode={resizeMode}
        onUpdateDragging={handleUpdateDragging}
        onUpdatePosition={onUpdatePosition}
        onDragEnd={handleDragEnd}
      >
        <ResizableBox
          text={`Draggable\nBox`}
          backgroundColor='#E6F7DA'
          borderColor='#93ED6F'
          width={boxSize.width}
          height={boxSize.height}
          step={step}
          stepBasePosition={stepBasePosition}
          shadowVisible={isDragging}
          onResizeHeight={handleResizeBox}
          onUpdateResizeMode={handleUpdateResizeMode}
        />
      </DraggableBox>
    </div>
  );
};
