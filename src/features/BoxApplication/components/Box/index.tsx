import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useBoxApp } from '@/features/BoxApplication/hooks/useBoxApp';

import styles from './index.module.scss';

import type { Position } from '@/features/BoxApplication/types';

type Props = {
  id: string;
  label: string;
  width: number;
  height: number;
  stepBasePosition: Position;
  localPosition: Position;
  borderColor: string;
  backgroundColor: string;
};

type Transform = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

export const Box: React.FC<Props> = ({ id, label, width, height, stepBasePosition, localPosition, borderColor, backgroundColor }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const { setSelectedBoxId, setHoveredBoxId, selectedBoxId, rowScale, setIsBoxEdge, setCurrentBoxElement, step, boxActionMode } = useBoxApp();
  const [transform, setTransform] = useState<Transform>({
    x: step.x * (stepBasePosition.x + localPosition.x),
    y: step.y * rowScale * (stepBasePosition.y + localPosition.y),
    scaleX: 1,
    scaleY: 1,
  });

  const style = useMemo(() => {
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: CSS.Translate.toString(transform),
    };
  }, [transform]);

  const innerStyle: React.CSSProperties = useMemo(() => {
    return {
      backgroundColor,
      borderColor,
    };
  }, [borderColor, backgroundColor]);

  const modifiedPosition = useMemo((): Position => {
    const position = { ...stepBasePosition };
    position.x = Math.round(position.x);
    position.y = Math.round(position.y);
    return position;
  }, [stepBasePosition]);

  useEffect(() => {
    setTransform({
      x: step.x * (modifiedPosition.x + localPosition.x),
      y: step.y * (modifiedPosition.y + localPosition.y),
      scaleX: 1,
      scaleY: 1,
    });
  }, [localPosition, modifiedPosition]);

  const handleMouseDown = useCallback(() => {
    if (boxRef.current) {
      setCurrentBoxElement(boxRef.current);
    }

    setSelectedBoxId(id);
  }, [id, boxRef]);

  const handleMouseEnter = useCallback(() => {
    if (boxActionMode) {
      return;
    }

    if (boxRef.current) {
      setCurrentBoxElement(boxRef.current);
    }

    setHoveredBoxId(id);
  }, [id, boxActionMode, boxRef]);

  const handleMouseLeave = useCallback(() => {
    setHoveredBoxId(undefined);
  }, []);

  return (
    <div
      ref={boxRef}
      style={style}
      className={clsx(styles.box)}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={clsx(styles.boxInner)} style={innerStyle}>
        <label className={clsx(styles.label)}>{label}</label>
      </div>
    </div>
  );
};
