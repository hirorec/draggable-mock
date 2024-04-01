import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollToPlugin);

import { BoxProps, ColumnProps, Position } from '@/features/BoxApplication/types';

import { BoxContainer } from './components/BoxContainer';
import { ColumnContainer } from './components/ColumnContainer';
import { ColumnHeader } from './components/ColumnHeader';
import { ColumnRowHeader } from './components/ColumnRowHeader';
import { ConfirmModal, ConfirmModalProps } from './components/ConfirmModal';
import { BOX_ACTION_MODE, STEP } from './const';
import { useBoxApp } from './hooks/useBoxApp';
import { useBoxConfirmModal } from './hooks/useBoxConfirmModal';
import styles from './index.module.scss';
import { colsWidthTotal } from './utils';

type Props = {
  onUpdateBoxList: (boxList: BoxProps[]) => void;
  onUpdateColumnList: (columnList: ColumnProps[]) => void;
};

export const BoxApplication: React.FC<Props> = ({ onUpdateBoxList, onUpdateColumnList }) => {
  const {
    initialized,
    isAppModifying,
    setInitialized,
    modifyData,
    viewportWidth,
    viewportHeight,
    windowWidth,
    rowScale,
    cursor,
    boxActionMode,
    maxHeight,
    changedBoxId,
    clickedBoxId,
    boxList,
    columnList,
    undoBoxList,
    selectedBoxId,
    step,
    updateBoxPosition,
  } = useBoxApp();
  const { showModal } = useBoxConfirmModal();
  const appInnerRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollMin, setIsScrollMin] = useState(false);
  const [isScrollMax, setIsScrollMax] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState<ConfirmModalProps>();

  useEffect(() => {
    if (changedBoxId && columnList && undoBoxList) {
      onBoxChange(changedBoxId);
    }
  }, [changedBoxId]);

  useEffect(() => {
    if (clickedBoxId) {
      console.log({ clickedBoxId });
    }
  }, [clickedBoxId]);

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
      if (boxActionMode === BOX_ACTION_MODE.DRAGGING && appInnerRef.current && !isScrollLocked) {
        const rect = appInnerRef.current.getBoundingClientRect();
        const rectMousePosition: Position = {
          x: e.clientX - rect.x - 65,
          y: e.clientY - rect.y,
        };

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

        const OFFSET_Y = 100;

        const setBoxY = (direction: boolean) => {
          if (boxList) {
            const index = boxList?.findIndex((b) => b.id === selectedBoxId);

            if (index > 0) {
              const box = boxList[index];
              let y = Math.round((rectMousePosition.y + scrollY) / step.y);

              if (!direction) {
                y = y - boxList[index].size.height;
              }

              updateBoxPosition(box, { x: box.position.x, y });
            }
          }
        };

        if (rectMousePosition.y + OFFSET_Y >= rect.height) {
          scrollTo(scrollX, scrollY + STEP.Y * 2, 0.1);
          setBoxY(true);
        } else if (rectMousePosition.y - OFFSET_Y <= 0) {
          scrollTo(scrollX, scrollY - STEP.Y * 2, 0.1);
          setBoxY(false);
        }

        if (rectMousePosition.x + OFFSET_Y > viewportWidth) {
          scrollTo(scrollX + STEP.X, scrollY, 0.2);
        } else if (rectMousePosition.x - OFFSET_Y <= 0) {
          scrollTo(scrollX - STEP.X, scrollY, 0.2);
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [appInnerRef, scrollX, scrollY, maxHeight, viewportWidth, viewportHeight, isScrollLocked, rowScale, boxActionMode]);

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

  const onBoxChange = async (changedBoxId: string) => {
    const index = boxList?.findIndex((box) => box.id === changedBoxId);

    if (!index || !boxList || !columnList || !undoBoxList) {
      return;
    }

    const updatedBox = boxList[index];

    if (!updatedBox) {
      return;
    }

    if (updatedBox.position.y < 0) {
      return;
    }

    const newBoxList = _.cloneDeep(boxList);

    const res = await new Promise<boolean>((resolve) => {
      showModal();
      setConfirmModalConfig({ onClose: resolve, box: newBoxList[index] });
    });
    setConfirmModalConfig(undefined);

    if (res) {
      newBoxList[index] = {
        ...newBoxList[index],
        position: {
          x: updatedBox.position.x + updatedBox.localPosition.x,
          y: updatedBox.position.y,
        },
      };

      newBoxList[index].position.x = Math.round(newBoxList[index].position.x);
      newBoxList[index].position.y = Math.round(newBoxList[index].position.y);

      const { boxList: modifiedBoxList, columnList: modifiedColumnList } = await modifyData(newBoxList, columnList, updatedBox);
      onUpdateBoxList(modifiedBoxList);
      onUpdateColumnList(modifiedColumnList);
    } else {
      onUpdateBoxList(undoBoxList);
    }
  };

  if (initialized && boxList && columnList) {
    return (
      <>
        <div className={clsx(styles.application)} style={{ cursor }}>
          <div ref={appInnerRef} className={clsx(styles.applicationInner)}>
            <ColumnHeader columnList={columnList} onScroll={handleColScroll} isScrollMin={isScrollMin} isScrollMax={isScrollMax} />
            <ColumnRowHeader columnList={columnList} />
            <ColumnContainer columnList={columnList}>
              <BoxContainer boxList={boxList} columnList={columnList} />
            </ColumnContainer>
          </div>
        </div>
        <ConfirmModal {...confirmModalConfig} />
      </>
    );
  } else {
    return null;
  }
};
