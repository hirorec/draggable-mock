import _ from 'lodash';
import { createContext, useState, useContext, useEffect } from 'react';

import * as modifier from '../utils/modifier';

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

    setIsAppModifying(true);
    const modifiedData = await modifier.modifyData(_.cloneDeep(boxList), _.cloneDeep(columnList), updatedBox, selectedBoxId);
    setIsAppModifying(false);
    return modifiedData;
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

export const BoxAppContext = createContext<BoxAppContextType>(null);
export const useBoxApp = () => useContext(BoxAppContext)!;
