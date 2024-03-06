import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DraggableBox } from '@/components/DraggableBox';
import { ResizableBox } from '@/components/ResizableBox';
import { STEP } from '@/const';
import { Position, Step } from '@/types';

import styles from './index.module.scss';
import { BoxOverlay } from '../BoxOverlay';

type Props = {
  width: number;
  step: Step;
};

export const BoxContainer: React.FC<Props> = ({ step, width }) => {
  const [boxHeight, setBoxHeight] = useState(STEP.Y * 4);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayBoxHeight, setOverlayBoxHeight] = useState(STEP.Y * 4);
  const [overlayPosition, setOverlayPosition] = useState<Position>({ x: 0, y: 0 });
  const [resizeMode, setResizeMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const sizeMin = useMemo(() => {
    return step.y;
  }, [step]);

  useEffect(() => {
    if (isDragging || resizeMode) {
      setOverlayBoxHeight(boxHeight);
      setOverlayVisible(true);
    } else {
      setOverlayVisible(false);
    }
  }, [isDragging, resizeMode]);

  const handleResizeBox = useCallback(
    (direction: boolean) => {
      let newBoxHeight = boxHeight;

      if (direction) {
        newBoxHeight = newBoxHeight + step.y;
      } else {
        newBoxHeight = newBoxHeight - step.y;
      }

      if (newBoxHeight <= sizeMin) {
        newBoxHeight = sizeMin;
      }

      setBoxHeight(newBoxHeight);
    },
    [sizeMin, boxHeight]
  );

  const handleUpdateResizeMode = (resizeMode: boolean) => {
    setResizeMode(resizeMode);
  };

  const handleUpdateDragging = (isDragging: boolean) => {
    setIsDragging(isDragging);
  };

  const handleUpdatePosition = (position: Position) => {};

  const handleDragEnd = (position: Position) => {
    setOverlayPosition(position);
  };

  return (
    <div className={clsx(styles.container)}>
      {overlayVisible && (
        <BoxOverlay
          width={width}
          height={overlayBoxHeight}
          position={overlayPosition}
          backgroundColor='#E6F7DA'
          borderColor='#93ED6F'
          text={`Draggable\nBox`}
        />
      )}

      <DraggableBox
        width={width}
        height={boxHeight}
        step={step}
        resizeMode={resizeMode}
        onUpdateDragging={handleUpdateDragging}
        onUpdatePosition={handleUpdatePosition}
        onDragEnd={handleDragEnd}
      >
        <ResizableBox
          text={`Draggable\nBox`}
          backgroundColor='#E6F7DA'
          borderColor='#93ED6F'
          width={width}
          height={boxHeight}
          step={step}
          shadowVisible={isDragging}
          onResizeHeight={handleResizeBox}
          onUpdateResizeMode={handleUpdateResizeMode}
        />
      </DraggableBox>
    </div>
  );
};
