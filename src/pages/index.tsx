import { DndContext } from '@dnd-kit/core';
import clsx from 'clsx';
import React, { useState } from 'react';

import { Draggable } from '@/components/Draggable';
import { ResizableBox } from '@/components/ResizableBox';

import styles from './index.module.scss';

const BOX_HEIGHT_STEP = 20;
const BOX_SIZE_MIN = BOX_HEIGHT_STEP;

export default function Page() {
  const [boxHeight, setBoxHeight] = useState(100);

  const handleResizeBox = (direction: boolean) => {
    let newBoxHeight = boxHeight;

    if (direction) {
      newBoxHeight = newBoxHeight + BOX_HEIGHT_STEP;
    } else {
      newBoxHeight = newBoxHeight - BOX_HEIGHT_STEP;
    }

    if (newBoxHeight <= BOX_SIZE_MIN) {
      newBoxHeight = BOX_SIZE_MIN;
    }

    setBoxHeight(newBoxHeight);
  };

  return (
    <div className={clsx(styles.container)}>
      <DndContext>
        <Draggable>
          <ResizableBox
            text={`Resizable\nBox`}
            backgroundColor='#E6F7DA'
            borderColor='#93ED6F'
            width={200}
            height={boxHeight}
            step={BOX_HEIGHT_STEP}
            onResizeHeight={handleResizeBox}
          />
        </Draggable>
      </DndContext>
    </div>
  );
}
