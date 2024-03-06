import clsx from 'clsx';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { RESIZABLE_BOX_WRAPPER_OFFSET } from '@/const';

import styles from './index.module.scss';

import type { MousePosition } from '@/types';

type Props = {
  text: string;
  borderColor: string;
  backgroundColor: string;
  width: number;
  height: number;
  step: number;
  onResizeHeight: (direction: boolean) => void;
};

export const ResizableBox: React.FC<Props> = ({ text, borderColor, backgroundColor, width, height, step, onResizeHeight }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isEdge, setIsEdge] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [resizeMode, setResizeMode] = useState(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  const wrapperStyle: React.CSSProperties = useMemo(() => {
    return {
      width: `${width}px`,
      height: `${height + RESIZABLE_BOX_WRAPPER_OFFSET * 2}px`,
      cursor: isEdge || resizeMode ? 'ns-resize' : 'unset',
      top: `${-RESIZABLE_BOX_WRAPPER_OFFSET}px`,
    };
  }, [width, height, step, isEdge, resizeMode]);

  const style: React.CSSProperties = useMemo(() => {
    return {
      top: `${RESIZABLE_BOX_WRAPPER_OFFSET}px`,
      height: `calc(100% - ${RESIZABLE_BOX_WRAPPER_OFFSET * 2}px)`,
      backgroundColor,
      borderColor,
    };
  }, [borderColor, backgroundColor, step, isEdge]);

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

      const isEdge = newMousePosition.y >= rect.height - step && newMousePosition.y < rect.height;
      setIsEdge(isEdge);
      setMousePosition(newMousePosition);

      if (resizeMode) {
        if (newMousePosition.y >= rect.height + step) {
          onResizeHeight(true);
        } else if (newMousePosition.y <= rect.height - step) {
          onResizeHeight(false);
        }
      }
    },
    [boxRef.current, mousePosition, isMouseDown, resizeMode]
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
      onClick={() => {
        console.log('click');
      }}
    >
      <div ref={boxRef} className={clsx(styles.box)} style={style}>
        {text}
      </div>
    </div>
  );
};
