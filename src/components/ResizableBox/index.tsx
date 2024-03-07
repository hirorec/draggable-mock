import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { RESIZABLE_BOX_WRAPPER_OFFSET } from '@/const';

import styles from './index.module.scss';

import type { Position, Step } from '@/types';

type Props = {
  text: string;
  borderColor: string;
  backgroundColor: string;
  width: number;
  height: number;
  step: Step;
  shadowVisible?: boolean;
  stepBasePosition: Position;
  onResizeHeight: (direction: boolean) => void;
  onUpdateResizeMode: (resizeMode: boolean) => void;
  onClick: () => void;
};

export const ResizableBox: React.FC<Props> = ({
  text,
  borderColor,
  backgroundColor,
  width,
  height,
  step,
  shadowVisible = false,
  stepBasePosition,
  onResizeHeight,
  onUpdateResizeMode,
  onClick,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isEdge, setIsEdge] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [resizeMode, setResizeMode] = useState(false);
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });

  const wrapperStyle: React.CSSProperties = useMemo(() => {
    return {
      width: `${width + RESIZABLE_BOX_WRAPPER_OFFSET.X * 2}px`,
      height: `${height + RESIZABLE_BOX_WRAPPER_OFFSET.Y * 2}px`,
      cursor: isEdge || resizeMode ? 'ns-resize' : 'unset',
      top: `${-RESIZABLE_BOX_WRAPPER_OFFSET.Y}px`,
      left: `${-RESIZABLE_BOX_WRAPPER_OFFSET.X}px`,
    };
  }, [width, height, step, isEdge, resizeMode]);

  const style: React.CSSProperties = useMemo(() => {
    return {
      top: `${RESIZABLE_BOX_WRAPPER_OFFSET.Y}px`,
      left: `${RESIZABLE_BOX_WRAPPER_OFFSET.X}px`,
      width: `calc(100% - ${RESIZABLE_BOX_WRAPPER_OFFSET.X * 2}px)`,
      height: `calc(100% - ${RESIZABLE_BOX_WRAPPER_OFFSET.Y * 2}px)`,
      // boxShadow: shadowVisible ? '0px 0px 10px rgba(0, 0, 0, 0.2)' : '',
      backgroundColor,
      borderColor,
    };
  }, [borderColor, backgroundColor, step, isEdge, shadowVisible]);

  useEffect(() => {
    onUpdateResizeMode(resizeMode || isEdge);
  }, [resizeMode, isEdge]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!boxRef.current) {
        return;
      }

      const box: HTMLDivElement = boxRef.current;
      const rect = box.getBoundingClientRect();

      const newMousePosition = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      };

      const offset = 10;
      const isEdge = newMousePosition.y >= rect.height - offset && newMousePosition.y < rect.height;
      setIsEdge(isEdge);
      setMousePosition(newMousePosition);

      if (resizeMode) {
        if (newMousePosition.y >= rect.height + step.y) {
          onResizeHeight(true);
        } else if (newMousePosition.y <= rect.height - step.y) {
          onResizeHeight(false);
        }
      }
    },
    [boxRef.current, mousePosition, isMouseDown, resizeMode, step]
  );

  const handleMouseDown = useCallback(() => {
    setIsMouseDown(true);

    if (isEdge) {
      setResizeMode(true);
    }
  }, [isEdge]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    setResizeMode(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  return (
    <div
      style={wrapperStyle}
      className={clsx(styles.boxWrapper)}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={boxRef} className={clsx(styles.box)} style={style} onClick={onClick}>
        {text}
      </div>
    </div>
  );
};
