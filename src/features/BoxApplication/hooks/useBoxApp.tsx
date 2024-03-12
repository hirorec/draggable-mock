import _ from 'lodash';
import React, { createContext, useState, useContext, useEffect } from 'react';

import { sleep } from '@/utils';

import { overlapBox } from '../utils';

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

    columnList.forEach((col, index) => {
      let overLapCount = 0;
      const overlappedIds: string[] = [];

      const boxInColList = boxList.filter((box) => {
        return box.colIndex === index;
      });

      boxInColList.forEach((boxA) => {
        boxInColList.forEach((boxB) => {
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

      columnList[index].colDiv = overLapCount + 1;

      const ids = _.uniq(overlappedIds);
      overlappedBoxData.push(ids);
      columnList[index].colDiv = Math.max(ids.length, 1);
      return col;
    });

    // console.log('overlappedBoxData', overlappedBoxData);

    //-----------------------------
    // ポジション設定
    //-----------------------------
    let x = 0;
    columnList.forEach((col, index) => {
      const boxListInCol = boxList.filter((box) => {
        return box.colIndex === index;
      });

      for (let i = 0; i < col.colDiv; i++) {
        boxListInCol.forEach((box) => {
          box.position.x = x - col.colDiv + 1;

          const overlappedBoxItem = overlappedBoxData[index];

          if (overlappedBoxItem.includes(box.id)) {
            box.size.width = 1;
          } else {
            box.size.width = col.colDiv;
          }
        });

        x++;
      }
    });

    // ローカルポジション設定
    overlappedBoxData.forEach((ids) => {
      const sortedIds = ids.sort((a, b) => {
        const boxA = boxList.find((box) => box.id === a);
        const boxB = boxList.find((box) => box.id === b);

        if (!boxA || !boxB) {
          return 0;
        }

        if (boxA.position.y < boxB.position.y) {
          return -1;
        } else if (boxA.position.y > boxB.position.y) {
          return 1;
        }

        return 0;
      });

      for (let i = 1; i < sortedIds.length; i++) {
        const id = sortedIds[i];
        const box = boxList.find((b) => b.id === id);

        if (box) {
          box.localPosition.x = i;
        }
      }
    });

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
