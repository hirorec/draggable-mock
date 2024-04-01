import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import styles from './index.module.scss';
import { useBoxApp } from '../../hooks/useBoxApp';

import type { Position, Transform } from '@/features/BoxApplication/types';

type Props = {
  text: string;
  borderColor: string;
  backgroundColor: string;
  width: number;
  height: number;
  position: Position;
  localPosition: Position;
};

export const BoxOverlay: React.FC<Props> = ({ text, borderColor, backgroundColor, width, height, position, localPosition }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const { rowScale, step } = useBoxApp();
  const [transform, setTransform] = useState<Transform>({
    x: step.x * (position.x + localPosition.x),
    y: step.y * rowScale * (position.y + localPosition.y),
    scaleX: 1,
    scaleY: 1,
  });

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

  const wrapperStyle = useMemo(() => {
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: CSS.Translate.toString(transform),
    };
  }, [transform]);

  const style = useMemo(() => {
    return {
      backgroundColor,
      borderColor,
    };
  }, [transform, borderColor, backgroundColor]);

  return (
    <div ref={boxRef} className={clsx(styles.boxWrapper)} style={wrapperStyle}>
      <div ref={boxRef} className={clsx(styles.box)} style={style}>
        {text}
      </div>
    </div>
  );
};
