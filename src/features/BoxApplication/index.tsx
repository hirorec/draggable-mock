import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

gsap.registerPlugin(ScrollToPlugin);

import { BoxProps, ColumnProps, Position } from '@/features/BoxApplication/types';

import { BoxContainer } from './components/BoxContainer';
import { ColumnContainer } from './components/ColumnContainer';
import { ColumnHeader } from './components/ColumnHeader';
import { ColumnRowHeader } from './components/ColumnRowHeader';
import { ConfirmModal } from './components/ConfirmModal';
import { STEP } from './const';
import { useBoxApp } from './hooks/useBoxApp';
import { useBoxConfirmModal } from './hooks/useBoxConfirmModal';
import styles from './index.module.scss';
import { colsWidthTotal, equalBoxPositionAndSize } from './utils';

type Props = {
  boxList?: BoxProps[];
  columnList?: ColumnProps[];
  maxHeight: number;
  onUpdateBox: (box: BoxProps, index: number) => void;
  onUpdateBoxList: (boxList: BoxProps[]) => void;
  onUpdateColumnList: (columnList: ColumnProps[]) => void;
};

export const BoxApplication: React.FC<Props> = ({ boxList, columnList, maxHeight, onUpdateBox, onUpdateBoxList, onUpdateColumnList }) => {
  const {
    initialized,
    isAppModifying,
    setInitialized,
    selectedBoxId,
    modifyData,
    viewportWidth,
    viewportHeight,
    windowWidth,
    isBoxDragging,
    rowScale,
  } = useBoxApp();
  const { showModal } = useBoxConfirmModal();
  const appInnerRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollMin, setIsScrollMin] = useState(false);
  const [isScrollMax, setIsScrollMax] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [undoBoxList, setUndoBoxList] = useState<BoxProps[]>([]);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{ onClose: (value: boolean) => void }>();

  const maxWidth = useMemo((): number => {
    return (
      columnList?.reduce((prev, current) => {
        return prev + current.colDiv;
      }, 0) || 0
    );
  }, [columnList]);

  useEffect(() => {
    if (!initialized && boxList && columnList) {
      (async () => {
        const { boxList: modifiedBoxList, columnList: modifiedColumnList } = await modifyData(boxList, columnList);
        onUpdateBoxList(modifiedBoxList);
        onUpdateColumnList(modifiedColumnList);
        setInitialized(true);
      })();
    }
  }, [initialized, isAppModifying, boxList, columnList]);

  useEffect(() => {
    const onScroll = (e: Event) => {
      const el = e.currentTarget as HTMLDivElement;
      setScrollX(el.scrollLeft);
      setScrollY(el.scrollTop);
    };

    if (appInnerRef.current) {
      appInnerRef.current.addEventListener('scroll', onScroll);
    }

    return () => {
      if (appInnerRef.current) {
        appInnerRef.current.removeEventListener('scroll', onScroll);
      }
    };
  });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isBoxDragging && appInnerRef.current && !isScrollLocked) {
        const rect = appInnerRef.current.getBoundingClientRect();
        const rectMousePosition: Position = {
          x: e.clientX - rect.x - 65,
          y: e.clientY - rect.y,
        };
        const colsHeight = maxHeight * STEP.Y;
        const maxScrollY = colsHeight - viewportHeight;

        const scrollTo = (x: number, y: number, duration: number) => {
          setIsScrollLocked(true);
          gsap.to(appInnerRef.current, {
            duration,
            ease: 'none',
            scrollTo: { x, y },
            onComplete: () => {
              setIsScrollLocked(false);
            },
          });
        };

        const offset = 50;

        if (rectMousePosition.y + offset >= rect.height && scrollY <= 0) {
          scrollTo(scrollX, maxScrollY, 0.3);
        } else if (rectMousePosition.y - offset <= 0) {
          scrollTo(scrollX, 0, 0.3);
        }

        if (rectMousePosition.x + offset > viewportWidth) {
          scrollTo(scrollX + STEP.X, scrollY, 0.2);
        } else if (rectMousePosition.x - offset <= 0) {
          scrollTo(scrollX - STEP.X, scrollY, 0.2);
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isBoxDragging, appInnerRef, scrollX, scrollY, maxHeight, viewportWidth, viewportHeight, isScrollLocked, rowScale]);

  useEffect(() => {
    const colsWidth = colsWidthTotal(columnList || []);
    const maxThreshold = colsWidth - viewportWidth;
    setIsScrollMin(false);
    setIsScrollMax(false);

    if (scrollX <= 0) {
      setIsScrollMin(true);
    }

    if (scrollX >= maxThreshold) {
      setIsScrollMax(true);
    }
  }, [scrollX, columnList, windowWidth]);

  const handleUpdateBoxSizeEnd = useCallback(
    async (resizedBox: BoxProps, index: number) => {
      if (!boxList || !columnList || !undoBoxList.length) {
        return;
      }

      // ポジションとサイズに変更が無い
      if (equalBoxPositionAndSize(boxList[index], undoBoxList[index])) {
        return;
      }

      const res = await new Promise<boolean>((resolve) => {
        showModal();
        setConfirmModalConfig({ onClose: resolve });
      });
      setConfirmModalConfig(undefined);

      if (res) {
        console.log('handleUpdateBoxSizeEnd', resizedBox);
        const { boxList: modifiedBoxData, columnList: modifiedColumnList } = await modifyData(boxList, columnList, resizedBox);
        onUpdateBoxList(modifiedBoxData);
        onUpdateColumnList(modifiedColumnList);
      } else {
        onUpdateBoxList(undoBoxList);
      }
    },
    [boxList, columnList, isAppModifying, undoBoxList]
  );

  const handleDropBox = useCallback(
    async (droppedBox: BoxProps, index: number) => {
      if (!boxList || !columnList || !undoBoxList.length) {
        return;
      }

      // ポジションとサイズに変更が無い
      if (equalBoxPositionAndSize(boxList[index], undoBoxList[index])) {
        return;
      }

      const res = await new Promise<boolean>((resolve) => {
        showModal();
        setConfirmModalConfig({ onClose: resolve });
      });
      setConfirmModalConfig(undefined);

      if (res) {
        console.log('handleDropBox', droppedBox);
        const newBoxList = _.cloneDeep(boxList);

        newBoxList[index] = {
          ...newBoxList[index],
          position: {
            x: droppedBox.position.x + droppedBox.localPosition.x,
            y: droppedBox.position.y,
          },
        };

        const { boxList: modifiedBoxList, columnList: modifiedColumnList } = await modifyData(newBoxList, columnList, droppedBox);
        onUpdateBoxList(modifiedBoxList);
        onUpdateColumnList(modifiedColumnList);
      } else {
        onUpdateBoxList(undoBoxList);
      }
    },
    [boxList, columnList, isAppModifying, selectedBoxId, initialized, undoBoxList]
  );

  const handleColScroll = useCallback(
    (direction: 1 | -1) => {
      if (appInnerRef.current) {
        const newScrollX = scrollX + STEP.X * direction;
        setScrollX(newScrollX);
        gsap.to(appInnerRef.current, { duration: 0.1, ease: 'none', scrollTo: { x: newScrollX, y: scrollY } });
      }
    },
    [appInnerRef.current, scrollX, scrollY, columnList, viewportWidth]
  );

  const handleInteractionStart = useCallback(async () => {
    if (!boxList) {
      return;
    }

    console.log('handleInteractionStart');
    const undoBoxList = _.cloneDeep(boxList);
    setUndoBoxList(undoBoxList);
  }, [boxList]);

  if (initialized && boxList && columnList) {
    return (
      <>
        <div className={clsx(styles.application)}>
          <div ref={appInnerRef} className={clsx(styles.applicationInner)}>
            <ColumnHeader columnList={columnList} onScroll={handleColScroll} isScrollMin={isScrollMin} isScrollMax={isScrollMax} />
            <ColumnRowHeader columnList={columnList} />
            <ColumnContainer columnList={columnList}>
              <BoxContainer
                boxList={boxList}
                columnList={columnList}
                maxWidth={maxWidth}
                maxHeight={maxHeight}
                onUpdateBox={onUpdateBox}
                onDropBox={handleDropBox}
                onUpdateBoxSizeEnd={handleUpdateBoxSizeEnd}
                onInteractionStart={handleInteractionStart}
              />
            </ColumnContainer>
          </div>
        </div>
        <ConfirmModal onClose={confirmModalConfig?.onClose} />
      </>
    );
  } else {
    return <></>;
  }
};
