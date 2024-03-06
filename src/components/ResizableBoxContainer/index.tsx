import clsx from 'clsx';
import React, { useCallback, useMemo, useState } from 'react';

import { ResizableBox } from '@/components/ResizableBox';
import { STEP } from '@/const';

import styles from './index.module.scss';

type Props = {
  width: number;
  step: number;
};

export const ResizableBoxContainer: React.FC<Props> = ({ step, width }) => {
  const [boxHeight, setBoxHeight] = useState(STEP.Y * 2);

  const sizeMin = useMemo(() => {
    return step;
  }, [step]);

  const handleResizeBox = useCallback(
    (direction: boolean) => {
      let newBoxHeight = boxHeight;

      if (direction) {
        newBoxHeight = newBoxHeight + step;
      } else {
        newBoxHeight = newBoxHeight - step;
      }

      if (newBoxHeight <= sizeMin) {
        newBoxHeight = sizeMin;
      }

      setBoxHeight(newBoxHeight);
    },
    [sizeMin, boxHeight]
  );

  return (
    <div className={clsx(styles.container)}>
      <ResizableBox
        text={`Resizable\nBox`}
        backgroundColor='#E6F7DA'
        borderColor='#93ED6F'
        width={width}
        height={boxHeight}
        step={step}
        onResizeHeight={handleResizeBox}
        onUpdateResizeMode={() => {}}
      />
    </div>
  );
};
