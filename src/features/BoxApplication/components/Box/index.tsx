import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useBoxApp } from '@/features/BoxApplication/hooks/useBoxApp';

import styles from './index.module.scss';

import type { Position, Transform } from '@/features/BoxApplication/types';

type Props = {
  id: string;
  label: string;
  width: number;
  height: number;
  position: Position;
  localPosition: Position;
  borderColor: string;
  backgroundColor: string;
};

export const Box: React.FC<Props> = ({ id, label, width, height, position, localPosition, borderColor, backgroundColor }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const { setSelectedBoxId, setHoveredBoxId, rowScale, setCurrentBoxElement, step, boxActionMode } = useBoxApp();
  const [transform, setTransform] = useState<Transform>({
    x: step.x * (position.x + localPosition.x),
    y: step.y * rowScale * (position.y + localPosition.y),
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
    const newPosition = { ...position };
    newPosition.x = Math.round(position.x);
    newPosition.y = Math.round(position.y);
    return newPosition;
  }, [position]);

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
