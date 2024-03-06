import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { BoxContainer } from '@/components/BoxContainer';
import { STEP } from '@/const';
import { Box, Position, Size } from '@/types';

import styles from './index.module.scss';

export default function Page() {
  const columnRef = useRef<HTMLDivElement>(null);
  const [columnDiv, setColumnDiv] = useState<number>(0);
  const [boxList, setBoxList] = useState<Box[]>([]);

  useEffect(() => {
    const boxList: Box[] = [
      {
        backgroundColor: '#E6F7DA',
        borderColor: '#93ED6F',
        text: `Draggable\nBox1`,
        position: {
          x: 1,
          y: 0,
        },
        size: {
          width: 1,
          height: 2,
        },
      },
      {
        backgroundColor: '#E6F7DA',
        borderColor: '#93ED6F',
        text: `Draggable\nBox2`,
        position: {
          x: 1,
          y: 2,
        },
        size: {
          width: 1,
          height: 3,
        },
      },
      {
        backgroundColor: '#E6F7DA',
        borderColor: '#93ED6F',
        text: `Draggable\nBox2`,
        position: {
          x: 1,
          y: 5,
        },
        size: {
          width: 1,
          height: 4,
        },
      },
    ];

    setBoxList(boxList);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [columnRef.current]);

  const borderNods = () => {
    if (columnDiv > 0) {
      return new Array(columnDiv - 1).fill({}).map((_, index) => {
        return <div className={clsx(styles.columnBgBorder)} key={index} style={{ top: `${STEP.Y * (index + 1)}px` }} />;
      });
    }
  };

  const handleResize = () => {
    if (!columnRef.current) {
      return;
    }

    const rect = columnRef.current.getBoundingClientRect();
    const div = Math.floor(rect.height / STEP.Y);
    setColumnDiv(div);
  };

  const handleUpdateBoxPosition = useCallback(
    (index: number, position: Position) => {
      const newBoxList = [...boxList];
      const box = { ...newBoxList[index] };

      if (box) {
        box.position = position;
        newBoxList[index] = box;
      }

      setBoxList(newBoxList);
    },
    [boxList]
  );

  const handleUpdateBoxSize = useCallback(
    (index: number, size: Size) => {
      const newBoxList = [...boxList];
      const box = { ...newBoxList[index] };

      if (box) {
        box.size = size;
        newBoxList[index] = box;
      }

      setBoxList(newBoxList);
    },
    [boxList]
  );

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx(styles.containerInner)}>
        <div className={clsx(styles.columnContainer)}>
          <div ref={columnRef} className={clsx(styles.column)}>
            <div className={clsx(styles.columnBg)}>{borderNods()}</div>
          </div>
          <div ref={columnRef} className={clsx(styles.column)}>
            <div className={clsx(styles.columnBg)}>{borderNods()}</div>
          </div>
          <div ref={columnRef} className={clsx(styles.column)}>
            <div className={clsx(styles.columnBg)}>{borderNods()}</div>
          </div>
          <div ref={columnRef} className={clsx(styles.column)}>
            <div className={clsx(styles.columnBg)}>{borderNods()}</div>
          </div>
        </div>
        <div className={clsx(styles.boxContainer)}>
          {boxList.map((box, index) => {
            return (
              <BoxContainer
                key={index}
                text={box.text}
                backgroundColor={box.backgroundColor}
                borderColor={box.borderColor}
                step={{ x: STEP.X, y: STEP.Y }}
                stepBaseSize={box.size}
                stepBasePosition={box.position}
                onUpdatePosition={(position: Position) => handleUpdateBoxPosition(index, position)}
                onUpdateSize={(size: Size) => handleUpdateBoxSize(index, size)}
              />
            );
          })}
        </div>

        {/* <div ref={columnRef} className={clsx(styles.column)}>
        <ResizableBoxContainer width={200} step={STEP.Y} />
      </div> */}
      </div>
    </div>
  );
}
