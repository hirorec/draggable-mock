import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

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
  stepBasePosition: Position;
  localPosition: Position;
  stepBaseSize: Size;
  zIndex: number;
};

export const BoxWrapper: React.FC<Props> = ({ id, label, borderColor, backgroundColor, stepBaseSize, stepBasePosition, localPosition, zIndex }) => {
  const { step, boxActionMode, selectedBoxId, isWindowMouseDown, onActionStart, onActionEnd } = useBoxApp();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayBoxHeight, setOverlayBoxHeight] = useState(stepBaseSize.height * STEP.Y);
  const [overlayPosition, setOverlayPosition] = useState<Position>({
    x: stepBasePosition.x,
    y: stepBasePosition.y,
  });

  const boxSize: Size = useMemo(() => {
    return {
      width: stepBaseSize.width * step.x,
      height: stepBaseSize.height * step.y,
    };
  }, [stepBaseSize, step]);

  useEffect(() => {
    if (boxActionMode && selectedBoxId === id) {
      setOverlayVisible(true);
    } else {
      setOverlayVisible(false);
    }
  }, [selectedBoxId, boxActionMode]);

  useEffect(() => {
    if (selectedBoxId === id) {
      if (isWindowMouseDown && selectedBoxId) {
        setOverlayBoxHeight(boxSize.height);
        setOverlayPosition(stepBasePosition);
        onActionStart(id);
      }

      if (!isWindowMouseDown && selectedBoxId) {
        onActionEnd(id);
      }
    }
  }, [isWindowMouseDown]);

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
        position={stepBasePosition}
        localPosition={localPosition}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
      />
    </div>
  );
};
