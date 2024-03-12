import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DraggableBox } from '@/features/BoxApplication/components/DraggableBox';
import { ResizableBox } from '@/features/BoxApplication/components/ResizableBox';
import { STEP } from '@/features/BoxApplication/const';
import { Position, Size, Step } from '@/features/BoxApplication/types';

import styles from './index.module.scss';
import { useBoxApp } from '../../hooks/useBoxApp';
import { BoxOverlay } from '../BoxOverlay';

type Props = {
  id: string;
  label: string;
  borderColor: string;
  backgroundColor: string;
  step: Step;
  stepBasePosition: Position;
  localPosition: Position;
  stepBaseSize: Size;
  zIndex: number;
  maxHeight: number;
  onUpdatePosition: (position: Position) => void;
  onUpdateSize: (size: Size) => void;
  onUpdateSizeEnd: (size: Size) => void;
  onDrop: (position: Position) => void;
  onClick: () => void;
};

export const Box: React.FC<Props> = ({
  id,
  label,
  borderColor,
  backgroundColor,
  step,
  stepBaseSize,
  stepBasePosition,
  localPosition,
  zIndex,
  maxHeight,
  onUpdatePosition,
  onUpdateSize,
  onUpdateSizeEnd,
  onDrop,
  onClick,
}) => {
  const { isAppModifying, isBoxDragging, setIsBoxDragging } = useBoxApp();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayBoxHeight, setOverlayBoxHeight] = useState(stepBaseSize.height * STEP.Y);
  const [overlayPosition, setOverlayPosition] = useState<Position>({
    x: stepBasePosition.x,
    y: stepBasePosition.y,
  });
  const [resizeMode, setResizeMode] = useState(false);

  const boxSize: Size = useMemo(() => {
    return {
      width: stepBaseSize.width * STEP.X,
      height: stepBaseSize.height * STEP.Y,
    };
  }, [stepBaseSize]);

  useEffect(() => {
    if (!isAppModifying) {
      setOverlayPosition(stepBasePosition);
    }
  }, [isAppModifying]);

  useEffect(() => {
    if (isBoxDragging || resizeMode) {
      setOverlayVisible(true);
    } else {
      setOverlayVisible(false);
    }

    if (isBoxDragging) {
      setOverlayBoxHeight(boxSize.height);
    }
  }, [isBoxDragging, resizeMode, boxSize]);

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

  const handleDragEnd = useCallback(
    (newStepBasePosition: Position) => {
      setOverlayPosition({ ...newStepBasePosition });
      onDrop(newStepBasePosition);
    },
    [overlayPosition, stepBasePosition]
  );

  const handleDragLeave = useCallback(
    (newStepBasePosition: Position) => {
      setOverlayPosition({ ...newStepBasePosition });
    },
    [overlayPosition, stepBasePosition]
  );

  const handleResizeBoxEnd = useCallback(() => {
    onUpdateSizeEnd(stepBaseSize);
    setOverlayBoxHeight(stepBaseSize.height * STEP.Y);
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
        id={id}
        width={boxSize.width}
        height={boxSize.height}
        step={step}
        stepBasePosition={stepBasePosition}
        localPosition={localPosition}
        resizeMode={resizeMode}
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
          onResizeHeight={handleResizeBox}
          onResizeHeightEnd={handleResizeBoxEnd}
          onUpdateResizeMode={handleUpdateResizeMode}
          onClick={onClick}
        />
      </DraggableBox>
    </div>
  );
};
