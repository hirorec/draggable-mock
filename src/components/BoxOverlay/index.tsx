import clsx from 'clsx';
import React, { useMemo, useRef } from 'react';

import { RESIZABLE_BOX_WRAPPER_OFFSET, STEP } from '@/const';

import styles from './index.module.scss';

import type { Position } from '@/types';

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

  const wrapperStyle: React.CSSProperties = useMemo(() => {
    return {
      width: `${width}px`,
      height: `${height + RESIZABLE_BOX_WRAPPER_OFFSET.Y * 2}px`,
      top: `${-RESIZABLE_BOX_WRAPPER_OFFSET.Y + (position.y + localPosition.y) * STEP.Y}px`,
      left: `${-RESIZABLE_BOX_WRAPPER_OFFSET.X + (position.x + localPosition.x) * STEP.X}px`,
    };
  }, [width, height, position]);

  const style: React.CSSProperties = useMemo(() => {
    return {
      top: `${RESIZABLE_BOX_WRAPPER_OFFSET.Y}px`,
      left: `${RESIZABLE_BOX_WRAPPER_OFFSET.X}px`,
      height: `calc(100% - ${RESIZABLE_BOX_WRAPPER_OFFSET.Y * 2}px)`,
      backgroundColor,
      borderColor,
    };
  }, [borderColor, backgroundColor]);

  return (
    <div style={wrapperStyle} className={clsx(styles.boxWrapper)}>
      <div ref={boxRef} className={clsx(styles.box)} style={style}>
        {text}
      </div>
    </div>
  );
};
