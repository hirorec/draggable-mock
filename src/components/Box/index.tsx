import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DraggableBox } from '@/components/DraggableBox';
import { ResizableBox } from '@/components/ResizableBox';
import { STEP } from '@/const';
import { Position, Size, Step } from '@/types';

import styles from './index.module.scss';
import { BoxOverlay } from '../BoxOverlay';

type Props = {
  label: string;
  borderColor: string;
  backgroundColor: string;
  step: Step;
  stepBasePosition: Position;
  localPosition: Position;
  stepBaseSize: Size;
  zIndex: number;
  isMouseDown: boolean;
  maxHeight: number;
  onUpdatePosition: (position: Position) => void;
  onUpdateSize: (size: Size) => void;
  onUpdateSizeEnd: (size: Size) => void;
  onDrop: (position: Position) => void;
  onClick: () => void;
};

export const Box: React.FC<Props> = ({
  label,
  borderColor,
  backgroundColor,
  step,
  stepBaseSize,
  stepBasePosition,
  localPosition,
  zIndex,
  isMouseDown,
  maxHeight,
  onUpdatePosition,
  onUpdateSize,
  onUpdateSizeEnd,
  onDrop,
  onClick,
}) => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayBoxHeight, setOverlayBoxHeight] = useState(step.y * 4);
  const [overlayPosition, setOverlayPosition] = useState<Position>({
    x: stepBasePosition.x,
    y: stepBasePosition.y,
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
        if (stepBasePosition.y + newBoxSize.height < maxHeight) {
          newBoxSize.height = stepBaseSize.height + 1;
        }
      } else {
        newBoxSize.height = stepBaseSize.height - 1;
      }

      if (newBoxSize.height <= 1) {
        newBoxSize.height = 1;
      }

      onUpdateSize(newBoxSize);
    },
    [stepBaseSize, maxHeight, stepBasePosition]
  );

  const handleUpdateResizeMode = (resizeMode: boolean) => {
    setResizeMode(resizeMode);
  };

  const handleUpdateDragging = (isDragging: boolean) => {
    setIsDragging(isDragging);
  };

  const handleDragEnd = useCallback(
    (newStepBasePosition: Position) => {
      setOverlayPosition({ ...newStepBasePosition });

      if (overlayPosition.x !== newStepBasePosition.x || overlayPosition.y !== newStepBasePosition.y) {
        onDrop(newStepBasePosition);
      }
    },
    [overlayPosition]
  );

  const handleDragLeave = useCallback(
    (newStepBasePosition: Position) => {
      setOverlayPosition({ ...newStepBasePosition });
    },
    [overlayPosition]
  );

  const handleResizeBoxEnd = useCallback(() => {
    onUpdateSizeEnd(stepBaseSize);
  }, [stepBaseSize]);

  return (
    <div className={clsx(styles.box)} style={{ zIndex }}>
      {overlayVisible && (
        <BoxOverlay
          text={label}
          backgroundColor={backgroundColor}
          borderColor={borderColor}
          width={boxSize.width}
          height={overlayBoxHeight}
          position={overlayPosition}
          localPosition={localPosition}
        />
      )}

      <DraggableBox
        width={boxSize.width}
        height={boxSize.height}
        step={step}
        stepBasePosition={stepBasePosition}
        localPosition={localPosition}
        resizeMode={resizeMode}
        isMouseDown={isMouseDown}
        onUpdateDragging={handleUpdateDragging}
        onUpdatePosition={onUpdatePosition}
        onDragEnd={handleDragEnd}
        onDragLeave={handleDragLeave}
      >
        <ResizableBox
          label={label}
          backgroundColor={backgroundColor}
          borderColor={borderColor}
          width={boxSize.width}
          height={boxSize.height}
          step={step}
          shadowVisible={isDragging}
          onResizeHeight={handleResizeBox}
          onResizeHeightEnd={handleResizeBoxEnd}
          onUpdateResizeMode={handleUpdateResizeMode}
          onClick={onClick}
        />
      </DraggableBox>
    </div>
  );
};
