import _ from 'lodash';
import React, { createContext, useState, useContext, useEffect } from 'react';

import { sleep } from '@/utils';

import { overlapBox, positionInBoxWithBoxLocalX, yInBox } from '../utils';

import type { BoxProps, ColumnProps } from '../types';

export type BoxAppContextType = {
  initialized: boolean;
  isAppModifying: boolean;
  isWindowMouseDown: boolean;
  selectedBoxId: string | undefined;
  windowWidth: number;
  viewportWidth: number;
  viewportHeight: number;
  isBoxDragging: boolean;
  setInitialized: (value: boolean) => void;
  setIsAppModifying: (value: boolean) => void;
  setSelectedBoxId: (value: string | undefined) => void;
  setIsBoxDragging: (value: boolean) => void;
  modifyData: (
    boxList: BoxProps[],
    columnList: ColumnProps[],
    updatedBox?: BoxProps
  ) => Promise<{
    boxList: BoxProps[];
    columnList: ColumnProps[];
  }>;
} | null;

export const useBoxAppOrigin = () => {
  const [initialized, setInitialized] = useState(false);
  const [isAppModifying, setIsAppModifying] = useState<boolean>(false);
  const [isWindowMouseDown, setIsWindowMouseDown] = useState<boolean>(false);
  const [selectedBoxId, setSelectedBoxId] = useState<string>();
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isBoxDragging, setIsBoxDragging] = useState(false);

  useEffect(() => {
    const onWindowMouseDown = () => {
      setIsWindowMouseDown(true);
    };

    const onWindowMouseUp = () => {
      setIsWindowMouseDown(false);
    };

    const onWindowResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('mousedown', onWindowMouseDown);
    window.addEventListener('mouseup', onWindowMouseUp);
    window.addEventListener('resize', onWindowResize);
    onWindowResize();

    return () => {
      window.removeEventListener('mousedown', onWindowMouseDown);
      window.removeEventListener('mouseup', onWindowMouseUp);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  useEffect(() => {
    const viewportWidth = windowWidth - 40 - 65;
    const viewportHeight = windowHeight - 100 - 40 - 20;
    setViewportWidth(viewportWidth);
    setViewportHeight(viewportHeight);
  }, [windowWidth, windowHeight]);

  const modifyData = async (
    boxList: BoxProps[],
    columnList: ColumnProps[],
    updatedBox?: BoxProps
  ): Promise<{
    boxList: BoxProps[];
    columnList: ColumnProps[];
  }> => {
    if (isAppModifying) {
      return {
        boxList,
        columnList,
      };
    }

    console.log('modifyData');
    setIsAppModifying(true);

    //-----------------------------
    // 操作boxの新しいcolIndexセット
    //-----------------------------
    if (updatedBox) {
      let x = 0;
      const updatedBoxIndex = boxList.findIndex((box) => box.id === updatedBox.id);

      columnList.forEach((col, index) => {
        for (let i = 0; i < col.colDiv; i++) {
          if (boxList[updatedBoxIndex].position.x === x) {
            boxList[updatedBoxIndex].position.x = x - col.colDiv;
            boxList[updatedBoxIndex].colIndex = index;
          }

          x++;
        }
      });
    }

    //-----------------------------
    // reset
    //-----------------------------
    boxList.forEach((box) => {
      box.localPosition.x = 0;
    });
    columnList.forEach((col, index) => {
      col.colDiv = 1;
    });
    columnList.forEach((_, index) => {
      const boxListInCol = boxList.filter((box) => {
        return box.colIndex === index;
      });

      boxListInCol.forEach((box) => {
        if (box.id !== selectedBoxId) {
          const boxIndex = boxList.findIndex((b) => b.id === box.id);

          if (boxIndex >= 0) {
            boxList[boxIndex].position.x = index;
          }
        }
      });
    });

    //-----------------------------
    // 重なり判定
    //-----------------------------
    const overlappedBoxData: string[][] = [];
    const rowOverlapCountMap: number[][] = [];

    columnList.forEach((col, index) => {
      // let overLapCount = 0;
      const overlappedIds: string[] = [];

      const boxListInCol = boxList.filter((box) => {
        return box.colIndex === index;
      });

      const rowOverlapCounts = new Array(col.rowDiv).fill({}).map((_, y) => {
        const rowOverlapCount = boxListInCol.reduce((prev, current) => {
          const isOverlap = yInBox(y, current);
          return prev + (isOverlap ? 1 : 0);
        }, 0);

        return Math.max(rowOverlapCount - 1, 0);
      });

      // console.log({ col: index }, rowOverlapCounts);
      const maxRowOverlapCount = _.max(rowOverlapCounts) || 0;
      rowOverlapCountMap.push(rowOverlapCounts);
      columnList[index].colDiv = maxRowOverlapCount + 1;

      boxListInCol.forEach((boxA) => {
        boxListInCol.forEach((boxB) => {
          if (boxB.id !== boxA.id) {
            const boxAClone = _.clone(boxA);
            const boxBClone = _.clone(boxB);

            if (initialized) {
              boxAClone.position.x = 0;
              boxBClone.position.x = 0;
            }

            const isOverlap = overlapBox(boxBClone, boxAClone);

            if (isOverlap) {
              overlappedIds.push(boxA.id, boxB.id);
            }
          }
        });
      });

      const ids = _.uniq(overlappedIds);
      overlappedBoxData.push(ids);
      // columnList[index].colDiv = Math.max(ids.length, 1);
      return col;
    });

    // console.log('overlappedBoxData', overlappedBoxData);
    console.log('rowOverlapCountsData', rowOverlapCountMap);

    //-----------------------------
    // ポジション設定
    //-----------------------------
    let x = 0;
    columnList.forEach(async (col, index) => {
      const boxListInCol = boxList.filter((box) => {
        return box.colIndex === index;
      });

      for (let i = 0; i < col.colDiv; i++) {
        boxListInCol.forEach((box, j) => {
          box.position.x = x - col.colDiv + 1;
        });

        x++;
      }

      boxListInCol.forEach(async (box, j) => {
        if (j <= 0) {
          return;
        }

        console.group(`box ${box.id}`);

        let x = 0;
        let loop = true;

        while (loop) {
          console.group(`x ${x}`);
          new Array(box.size.height).fill({}).forEach((_, boxRow) => {
            console.group(`row ${boxRow}`);
            const y = box.position.y + boxRow;
            const boxTargets = [...boxListInCol].slice(0, j);
            const hasOverlap = boxTargets.some((targetBox) => {
              if (box.id === targetBox.id) {
                return false;
              }
              return positionInBoxWithBoxLocalX({ x, y }, targetBox);
            });

            console.log({ x, y, hasOverlap });

            if (hasOverlap) {
              box.localPosition.x += 1;
            } else {
              loop = false;
              console.groupEnd();
              return;
            }

            x++;
            console.groupEnd();
          });
          console.groupEnd();
        }

        console.groupEnd();
      });

      await sleep(0);
    });

    // ローカルポジション設定
    // overlappedBoxData.forEach((ids) => {
    //   const sortedIds = ids.sort((a, b) => {
    //     const boxA = boxList.find((box) => box.id === a);
    //     const boxB = boxList.find((box) => box.id === b);

    //     if (!boxA || !boxB) {
    //       return 0;
    //     }

    //     if (boxA.position.y < boxB.position.y) {
    //       return -1;
    //     } else if (boxA.position.y > boxB.position.y) {
    //       return 1;
    //     }

    //     return 0;
    //   });

    //   for (let i = 1; i < sortedIds.length; i++) {
    //     const id = sortedIds[i];
    //     const box = boxList.find((b) => b.id === id);

    //     if (box) {
    //       // box.localPosition.x = i;
    //     }
    //   }
    // });

    await sleep(0);
    setIsAppModifying(false);
    // console.log(boxList, columnList);
    return {
      boxList,
      columnList,
    };
  };

  return {
    initialized,
    isAppModifying,
    isWindowMouseDown,
    windowWidth,
    viewportWidth,
    viewportHeight,
    selectedBoxId,
    isBoxDragging,
    setInitialized,
    setIsAppModifying,
    setSelectedBoxId,
    setIsBoxDragging,
    modifyData,
  };
};

const BoxAppContext = createContext<BoxAppContextType>(null);

export const BoxAppProvider = ({ children, value }: { children: React.ReactNode; value: BoxAppContextType }) => {
  return <BoxAppContext.Provider value={value}>{children}</BoxAppContext.Provider>;
};

export const useBoxApp = () => useContext(BoxAppContext)!;
