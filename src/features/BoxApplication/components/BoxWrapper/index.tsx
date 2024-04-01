import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { STEP } from '@/features/BoxApplication/const';
import { Position, Size } from '@/features/BoxApplication/types';

import styles from './index.module.scss';
import { useBoxApp } from '../../hooks/useBoxApp';
import { Box } from '../Box';
import { BoxOverlay } from '../BoxOverlay';

type Props = {
  id: string;
  label: string;
  borderColor: string;
  backgroundColor: string;
  // step: Step;
  stepBasePosition: Position;
  localPosition: Position;
  stepBaseSize: Size;
  zIndex: number;
  maxHeight: number;
  onUpdatePosition: (position: Position) => void;
  onUpdateSize: (size: Size) => void;
  onUpdateSizeEnd: (size: Size) => void;
  onDrop: (position: Position) => void;
  onInteractionStart: () => void;
  onClick: () => void;
};

export const BoxWrapper: React.FC<Props> = ({
  id,
  label,
  borderColor,
  backgroundColor,
  // step,
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
  onInteractionStart,
}) => {
  const { isAppModifying, selectedBoxId, rowScale, step } = useBoxApp();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayBoxHeight, setOverlayBoxHeight] = useState(stepBaseSize.height * STEP.Y);
  const [overlayPosition, setOverlayPosition] = useState<Position>({
    x: stepBasePosition.x,
    y: stepBasePosition.y,
  });
  const [isMouseDown, setIsMouseDown] = useState(false);

  const boxSize: Size = useMemo(() => {
    return {
      width: stepBaseSize.width * step.x,
      height: stepBaseSize.height * step.y,
    };
  }, [stepBaseSize, step]);

  useEffect(() => {
    setOverlayBoxHeight(stepBaseSize.height * step.y);
    setOverlayPosition(stepBasePosition);
  }, [step]);

  useEffect(() => {
    if (!isAppModifying) {
      setOverlayPosition(stepBasePosition);
    }
  }, [isAppModifying]);

  // useEffect(() => {
  //   if (id === selectedBoxId && resizeMode) {
  //     // TODO
  //     console.log('resize start');
  //   }
  // }, [resizeMode, selectedBoxId, id]);

  // useEffect(() => {
  //   if (id === selectedBoxId && isBoxDragging) {
  //     onInteractionStart();
  //   }
  // }, [isBoxDragging, selectedBoxId, id]);

  // useEffect(() => {
  //   if ((isBoxDragging || resizeMode) && selectedBoxId === id) {
  //     setOverlayVisible(true);
  //   } else {
  //     setOverlayVisible(false);
  //   }

  //   if (isBoxDragging) {
  //     setOverlayBoxHeight(boxSize.height);
  //   }
  // }, [isBoxDragging, resizeMode, boxSize, selectedBoxId]);

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
    [stepBaseSize, maxHeight, stepBasePosition, rowScale]
  );

  // const handleUpdateResizeMode = useCallback(
  //   (resizeMode: boolean) => {
  //     if (resizeMode && isMouseDown) {
  //       setResizeMode(true);
  //     } else {
  //       setResizeMode(false);
  //     }
  //   },
  //   [isMouseDown]
  // );

  const handleDragStart = useCallback(
    (newStepBasePosition: Position) => {
      console.log('handleDragStart');
      setOverlayPosition({ x: newStepBasePosition.x, y: newStepBasePosition.y * rowScale });
    },
    [overlayPosition, stepBasePosition, rowScale]
  );

  // const handleDragEnd = useCallback(
  //   (newStepBasePosition: Position) => {
  //     if (resizeMode) {
  //       return;
  //     }

  //     setOverlayPosition({ x: newStepBasePosition.x, y: newStepBasePosition.y * rowScale });
  //     onDrop(newStepBasePosition);
  //   },
  //   [overlayPosition, stepBasePosition, rowScale, resizeMode]
  // );

  const handleDragLeave = useCallback(
    (newStepBasePosition: Position) => {
      setOverlayPosition({ x: newStepBasePosition.x, y: newStepBasePosition.y * rowScale });
    },
    [overlayPosition, stepBasePosition, rowScale]
  );

  const handleResizeBoxEnd = useCallback(() => {
    onUpdateSizeEnd(stepBaseSize);
    setOverlayBoxHeight(stepBaseSize.height * STEP.Y * rowScale);
  }, [stepBaseSize, rowScale]);

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

      <Box
        id={id}
        label={label}
        width={boxSize.width}
        height={boxSize.height}
        // step={step}
        stepBasePosition={stepBasePosition}
        localPosition={localPosition}
        // resizeMode={resizeMode}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        // isMouseDown={isMouseDown}
        // setIsMouseDown={setIsMouseDown}
        // onUpdatePosition={onUpdatePosition}
        // onDragStart={handleDragStart}
        // onDragEnd={handleDragEnd}
        // onDragLeave={handleDragLeave}
      />

      {/* <DraggableBox
        id={id}
        width={boxSize.width}
        height={boxSize.height}
        step={step}
        stepBasePosition={stepBasePosition}
        localPosition={localPosition}
        resizeMode={resizeMode}
        isMouseDown={isMouseDown}
        setIsMouseDown={setIsMouseDown}
        onUpdatePosition={onUpdatePosition}
        onDragStart={handleDragStart}
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
          isMouseDown={isMouseDown}
          setIsMouseDown={setIsMouseDown}
          onResizeHeight={handleResizeBox}
          onResizeHeightEnd={handleResizeBoxEnd}
          onUpdateResizeMode={handleUpdateResizeMode}
          onClick={onClick}
        />
      </DraggableBox> */}
    </div>
  );
};
