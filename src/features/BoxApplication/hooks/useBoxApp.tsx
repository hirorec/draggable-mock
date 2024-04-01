import _ from 'lodash';
import { createContext, useState, useContext, useEffect } from 'react';

import { BOX_ACTION_MODE, CURSOR, DEFAULT_ROW_DIV, DEFAULT_ROW_INTERVAL } from '../const';
import * as modifier from '../utils/modifier';

import type { BoxActionMode, BoxProps, ColumnProps, Cursor } from '../types';

export type BoxAppContextType = {
  initialized: boolean;
  isAppModifying: boolean;
  isWindowMouseDown: boolean;
  selectedBoxId: string | undefined;
  hoveredBoxId: string | undefined;
  windowWidth: number;
  viewportWidth: number;
  viewportHeight: number;
  rowInterval: number;
  rowDiv: number;
  rowScale: number;
  // isBoxDragging: boolean;
  // resizeMode: boolean;
  cursor: Cursor;
  isBoxEdge: boolean;
  currentBoxElement: HTMLDivElement;

  setInitialized: (value: boolean) => void;
  setIsAppModifying: (value: boolean) => void;
  setSelectedBoxId: (value: string | undefined) => void;
  setHoveredBoxId: (value: string | undefined) => void;
  setRowInterval: (value: number) => void;
  setRowDiv: (value: number) => void;
  setRowScale: (value: number) => void;
  // setIsBoxDragging: (value: boolean) => void;
  // setResizeMode: (value: boolean) => void;
  setCursor: (value: Cursor) => void;
  setIsBoxEdge: (value: boolean) => void;
  setCurrentBoxElement: (value: HTMLDivElement) => void;
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
  const [hoveredBoxId, setHoveredBoxId] = useState<string>();
  const [currentBoxElement, setCurrentBoxElement] = useState<HTMLDivElement | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [rowInterval, setRowInterval] = useState(DEFAULT_ROW_INTERVAL);
  const [rowDiv, setRowDiv] = useState(DEFAULT_ROW_DIV);
  const [rowScale, setRowScale] = useState(1);
  const [boxActionMode, setBoxActionMode] = useState<BoxActionMode>();

  // const [isBoxDragging, setIsBoxDragging] = useState(false);
  // const [resizeMode, setResizeMode] = useState(false);
  const [isBoxEdge, setIsBoxEdge] = useState(false);
  const [cursor, setCursor] = useState<Cursor>(CURSOR.UNSET);

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
    window.addEventListener('mousemove', onWindowMouseMove);

    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove);
    };
  }, [isWindowMouseDown, selectedBoxId, boxActionMode, currentBoxElement]);

  useEffect(() => {
    const viewportWidth = windowWidth - 40 - 65;
    const viewportHeight = windowHeight - 100 - 40 - 20;
    setViewportWidth(viewportWidth);
    setViewportHeight(viewportHeight);
  }, [windowWidth, windowHeight]);

  useEffect(() => {
    if (isWindowMouseDown && selectedBoxId) {
      if (isBoxEdge) {
        setBoxActionMode(BOX_ACTION_MODE.RESIZE);
      } else {
        setCursor(CURSOR.MOVE);
        setBoxActionMode(BOX_ACTION_MODE.DRAGGING);
      }
    }

    if (!isWindowMouseDown) {
      setCurrentBoxElement(null);
      setBoxActionMode(undefined);
      setSelectedBoxId(undefined);
    }
  }, [isWindowMouseDown]);

  useEffect(() => {
    if (boxActionMode) {
      if (boxActionMode === BOX_ACTION_MODE.DRAGGING) {
        setCursor(CURSOR.MOVE);
      } else if (boxActionMode === BOX_ACTION_MODE.RESIZE) {
        setCursor(CURSOR.RESIZE);
      }

      return;
    }

    if (hoveredBoxId) {
      if (isBoxEdge) {
        setCursor(CURSOR.RESIZE);
      } else {
        setCursor(CURSOR.POINTER);
      }
    } else {
      setCursor(CURSOR.UNSET);
    }
  }, [hoveredBoxId, isBoxEdge, boxActionMode]);

  // useEffect(() => {
  //   console.log({ currentBoxElement, selectedBoxId });
  // }, [currentBoxElement, selectedBoxId]);

  const onWindowMouseMove = () => {
    if (boxActionMode) {
      // console.log({ boxActionMode, currentBoxElement });
    }
  };

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
    hoveredBoxId,
    // isBoxDragging,
    rowInterval,
    rowDiv,
    rowScale,
    // resizeMode,
    cursor,
    isBoxEdge,
    currentBoxElement,

    setInitialized,
    setIsAppModifying,
    setSelectedBoxId,
    setHoveredBoxId,
    // setIsBoxDragging,
    setRowInterval,
    setRowDiv,
    setRowScale,
    modifyData,
    // setResizeMode,
    setCursor,
    setIsBoxEdge,
    setCurrentBoxElement,
  };
};

export const BoxAppContext = createContext<BoxAppContextType>(null);
export const useBoxApp = () => useContext(BoxAppContext)!;
