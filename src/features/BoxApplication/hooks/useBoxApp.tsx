import _ from 'lodash';
import { createContext, useState, useContext, useEffect, useMemo } from 'react';

import { BOX_ACTION_MODE, CURSOR, DEFAULT_ROW_DIV, DEFAULT_ROW_INTERVAL, STEP } from '../const';
import * as modifier from '../utils/modifier';

import type { BoxActionMode, BoxProps, ColumnProps, Cursor, Position, Step } from '../types';

export type BoxAppContextType = {
  initialized: boolean;
  boxList: BoxProps[] | undefined;
  columnList: ColumnProps[] | undefined;
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
  currentBoxElement: HTMLDivElement | null;
  step: Step;
  boxActionMode: BoxActionMode;
  maxWidth: number;
  maxHeight: number;

  setInitialized: (value: boolean) => void;
  setBoxList: (value: BoxProps[]) => void;
  setColumnList: (value: ColumnProps[]) => void;
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
  setCurrentBoxElement: (value: HTMLDivElement | null) => void;
  setStep: (value: Step) => void;

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
  const [boxList, setBoxList] = useState<BoxProps[]>();
  const [columnList, setColumnList] = useState<ColumnProps[]>();
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
  const [mousePosition, setMousePosition] = useState<Position>();
  const [mouseMoveAmount, setMouseMoveAmount] = useState<Position>({ x: 0, y: 0 });
  const [step, setStep] = useState<Step>({ x: STEP.X, y: STEP.Y * rowScale });
  const [isBoxEdge, setIsBoxEdge] = useState(false);
  const [cursor, setCursor] = useState<Cursor>(CURSOR.UNSET);

  const maxWidth = useMemo((): number => {
    return (
      columnList?.reduce((prev, current) => {
        return prev + current.colDiv;
      }, 0) || 0
    );
  }, [columnList]);

  const maxHeight = useMemo((): number => {
    return rowDiv;
  }, [rowDiv]);

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
  }, [isWindowMouseDown, selectedBoxId, boxActionMode, currentBoxElement, mousePosition, boxList]);

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

  useEffect(() => {
    console.log({ hoveredBoxId });
  }, [hoveredBoxId]);

  // useEffect(() => {
  //   console.log({ currentBoxElement, selectedBoxId });
  // }, [currentBoxElement, selectedBoxId]);

  const onWindowMouseMove = (e: MouseEvent) => {
    if (boxActionMode && boxList) {
      const box = boxList.find((b) => b.id === selectedBoxId);

      if (!box || !currentBoxElement) {
        return;
      }

      const newMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };

      if (!mousePosition) {
        setMousePosition(newMousePosition);
        return;
      }

      if (boxActionMode === BOX_ACTION_MODE.DRAGGING) {
        const dx = newMousePosition.x - mousePosition.x;
        const dy = newMousePosition.y - mousePosition.y;
        // console.log({ dx, dy });
        const newMouseMoveAmount = { ...mouseMoveAmount };
        newMouseMoveAmount.x = newMouseMoveAmount.x + dx;
        newMouseMoveAmount.y = newMouseMoveAmount.y + dy;

        const rect = currentBoxElement.getBoundingClientRect();
        const rectMousePosition = {
          x: e.clientX - rect.x,
          y: e.clientY - rect.y,
        };

        const newPosition = { ...box.position };
        const y = newPosition.y + dy / step.y;
        newPosition.y = y;

        if (rectMousePosition.x >= rect.width && boxActionMode === BOX_ACTION_MODE.DRAGGING) {
          newPosition.x = newPosition.x + 1;
          resetMouseMoveAmount();
        } else if (rectMousePosition.x <= 0 && boxActionMode === BOX_ACTION_MODE.DRAGGING) {
          newPosition.x = newPosition.x - 1;
          resetMouseMoveAmount();
        } else {
          setMouseMoveAmount(newMouseMoveAmount);
        }

        updateBoxPosition(_.cloneDeep(box), newPosition);
        // onUpdateBoxPosition(box, newPosition);
      }

      setMousePosition(newMousePosition);
    }
  };

  const resetMouseMoveAmount = () => {
    setMouseMoveAmount({ x: 0, y: 0 });
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

  const updateBoxPosition = (box: BoxProps, position: Position) => {
    const newPosition = { ...position };
    const maxY = maxHeight * (1 / rowScale);

    if (newPosition.x + box.localPosition.x < 0) {
      newPosition.x = 0;
    }

    if (newPosition.y < 0) {
      newPosition.y = 0;
    }

    if (newPosition.y + box.size.height > maxY) {
      newPosition.y = maxY - box.size.height;
    }

    if (position.x + box.size.width > maxWidth) {
      newPosition.x = maxWidth - box.size.width;
    }

    if (box) {
      box.position = { ...newPosition };
      // onUpdateBox(box, index);

      if (boxList) {
        const index = boxList.findIndex((b) => b.id === box.id);

        if (index >= 0) {
          const newBoxList = _.cloneDeep(boxList);
          newBoxList[index] = box;
          setBoxList(newBoxList);
        }
      }
    }
  };

  return {
    initialized,
    boxList,
    columnList,
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
    step,
    boxActionMode,
    maxWidth,
    maxHeight,

    setInitialized,
    setBoxList,
    setColumnList,
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
    setStep,
  };
};

export const BoxAppContext = createContext<BoxAppContextType>(null);
export const useBoxApp = () => useContext(BoxAppContext)!;
