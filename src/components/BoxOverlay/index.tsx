import clsx from 'clsx';
import React, { useMemo, useRef } from 'react';

import { RESIZABLE_BOX_WRAPPER_OFFSET } from '@/const';

import styles from './index.module.scss';

type Props = {
  text: string;
  borderColor: string;
  backgroundColor: string;
  width: number;
  height: number;
  step: number;
};

export const BoxOverlay: React.FC<Props> = ({ text, borderColor, backgroundColor, width, height, step }) => {
  const boxRef = useRef<HTMLDivElement>(null);

  const wrapperStyle: React.CSSProperties = useMemo(() => {
    return {
      width: `${width}px`,
      height: `${height + RESIZABLE_BOX_WRAPPER_OFFSET * 2}px`,
      top: `${-RESIZABLE_BOX_WRAPPER_OFFSET}px`,
    };
  }, [width, height, step]);

  const style: React.CSSProperties = useMemo(() => {
    return {
      top: `${RESIZABLE_BOX_WRAPPER_OFFSET}px`,
      height: `calc(100% - ${RESIZABLE_BOX_WRAPPER_OFFSET * 2}px)`,
      backgroundColor,
      borderColor,
    };
  }, [borderColor, backgroundColor, step]);

  return (
    <div style={wrapperStyle} className={clsx(styles.boxWrapper)}>
      <div ref={boxRef} className={clsx(styles.box)} style={style}>
        {text}
      </div>
    </div>
  );
};