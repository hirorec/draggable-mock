import _ from 'lodash';
import { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

import { BOX_ACTION_MODE, CURSOR, DEFAULT_ROW_DIV, DEFAULT_ROW_INTERVAL, STEP } from '../const';
import { equalBoxPositionAndSize } from '../utils';
import * as modifier from '../utils/modifier';

import type { BoxActionMode, BoxProps, ColumnProps, Cursor, Position, Size, Step } from '../types';

export type BoxAppContextType = {
  initialized: boolean;
  boxList: BoxProps[] | undefined;
  undoBoxList: BoxProps[] | undefined;
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
  cursor: Cursor;
  isBoxEdge: boolean;
  currentBoxElement: HTMLDivElement | null;
  columnContainerElement: HTMLDivElement | null;
  step: Step;
  boxActionMode: BoxActionMode | undefined;
  maxWidth: number;
  maxHeight: number;
  changedBoxId: string | undefined;
  clickedBoxId: string | undefined;

  setInitialized: (value: boolean) => void;
  setBoxList: (value: BoxProps[]) => void;
  setColumnList: (value: ColumnProps[]) => void;
  setIsAppModifying: (value: boolean) => void;
  setSelectedBoxId: (value: string | undefined) => void;
  setHoveredBoxId: (value: string | undefined) => void;
  setRowInterval: (value: number) => void;
  setRowDiv: (value: number) => void;
  setRowScale: (value: number) => void;
  setCursor: (value: Cursor) => void;
  setIsBoxEdge: (value: boolean) => void;
  setCurrentBoxElement: (value: HTMLDivElement | null) => void;
  setColumnContainerElement: (value: HTMLDivElement | null) => void;
  setStep: (value: Step) => void;

  onActionStart: (boxId: string) => void;
  onActionEnd: (boxId: string) => void;

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
  const [undoBoxList, setUndoBoxList] = useState<BoxProps[]>();
  const [columnList, setColumnList] = useState<ColumnProps[]>();
  const [isAppModifying, setIsAppModifying] = useState<boolean>(false);
  const [isWindowMouseDown, setIsWindowMouseDown] = useState<boolean>(false);
  const [selectedBoxId, setSelectedBoxId] = useState<string>();
  const [hoveredBoxId, setHoveredBoxId] = useState<string>();
  const [currentBoxElement, setCurrentBoxElement] = useState<HTMLDivElement | null>(null);
  const [columnContainerElement, setColumnContainerElement] = useState<HTMLDivElement | null>(null);
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
  const [changedBoxId, setChangedBoxId] = useState<string>();
  const [clickedBoxId, setClickedBoxId] = useState<string>();

  //-------------------------
  // event handler
  //-------------------------

  const handleWindowMouseMove = useCallback(
    (event: MouseEvent) => {
      // console.log(currentBoxElement);
      if (!currentBoxElement || !columnContainerElement) {
        return;
      }

      if (boxList) {
        const newMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };

        if (!mousePosition) {
          setMousePosition(newMousePosition);
          return;
        }

        const rect = currentBoxElement.getBoundingClientRect();
        const columnContainerRect = columnContainerElement.getBoundingClientRect();

        const EDGE_OFFSET_Y = 10;
        const isEdge = newMousePosition.y >= rect.y + rect.height - EDGE_OFFSET_Y && newMousePosition.y < rect.y + rect.height;
        setIsBoxEdge(isEdge);

        if (isEdge) {
          setCursor(CURSOR.RESIZE);
        } else if (!boxActionMode && hoveredBoxId) {
          setCursor(CURSOR.POINTER);
        }

        if (!boxActionMode) {
          return;
        }

        const box = boxList.find((b) => b.id === selectedBoxId);

        if (!box) {
          return;
        }

        const newPosition = { ...box.position };
        const newMouseMoveAmount = { ...mouseMoveAmount };
        const dx = newMousePosition.x - mousePosition.x;
        const dy = newMousePosition.y - mousePosition.y;
        newMouseMoveAmount.x = newMouseMoveAmount.x + dx;
        newMouseMoveAmount.y = newMouseMoveAmount.y + dy;

        // 移動
        if (boxActionMode === BOX_ACTION_MODE.DRAGGING) {
          const rectMousePosition = {
            x: event.clientX - rect.x,
            y: event.clientY - rect.y,
          };

          const columnContainerMousePosition = {
            x: event.clientX - columnContainerRect.x,
            y: event.clientY - columnContainerRect.y,
          };

          if (columnContainerMousePosition.y >= STEP.Y && columnContainerMousePosition.x >= 0) {
            const y = newPosition.y + dy / step.y;
            newPosition.y = y;

            if (rectMousePosition.x >= rect.width) {
              newPosition.x = newPosition.x + 1;
              resetMouseMoveAmount();
            } else if (rectMousePosition.x <= 0) {
              newPosition.x = newPosition.x - 1;
              resetMouseMoveAmount();
            }

            updateBoxPosition(_.cloneDeep(box), newPosition);
          }
        }

        // リサイズ
        else if (boxActionMode === BOX_ACTION_MODE.RESIZE) {
          const newSize = { ...box.size };
          const mouseY = newMousePosition.y - rect.y;
          const height = mouseY / step.y;
          let modifiedHeight = Math.round(height);

          if (modifiedHeight < 1) {
            modifiedHeight = 1;
          }

          newSize.height = modifiedHeight;
          updateBoxSize(_.cloneDeep(box), newSize);
        }

        setMouseMoveAmount(newMouseMoveAmount);
        setMousePosition(newMousePosition);
      }
    },
    [isWindowMouseDown, selectedBoxId, boxActionMode, currentBoxElement, mousePosition, hoveredBoxId, step, boxList, columnContainerElement]
  );

  const handleWindowMouseDown = () => {
    setIsWindowMouseDown(true);
  };

  const handleWindowMouseUp = () => {
    setIsWindowMouseDown(false);
  };

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  //-------------------------
  // useMemo
  //-------------------------

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

  //-------------------------
  // useEffect
  //-------------------------

  useEffect(() => {
    window.addEventListener('mousedown', handleWindowMouseDown);
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();

    return () => {
      window.removeEventListener('mousedown', handleWindowMouseDown);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, [handleWindowMouseMove]);

  useEffect(() => {
    const viewportWidth = windowWidth - 40 - 65;
    const viewportHeight = windowHeight - 100 - 40 - 20;
    setViewportWidth(viewportWidth);
    setViewportHeight(viewportHeight);
  }, [windowWidth, windowHeight]);

  useEffect(() => {
    if (isWindowMouseDown && selectedBoxId) {
      setMousePosition(undefined);

      if (isBoxEdge) {
        setBoxActionMode(BOX_ACTION_MODE.RESIZE);
      } else {
        setCursor(CURSOR.MOVE);
        setBoxActionMode(BOX_ACTION_MODE.DRAGGING);
      }
    }

    if (!isWindowMouseDown) {
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

  //-------------------------
  // methods
  //-------------------------

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
    const maxX = maxWidth;

    if (newPosition.x + box.localPosition.x < 0) {
      newPosition.x = 0;
    }

    if (newPosition.y < 0) {
      newPosition.y = 0;
    }

    if (newPosition.y + box.size.height > maxY) {
      newPosition.y = maxY - box.size.height;
    }

    if (position.x + box.size.width >= maxX) {
      newPosition.x = position.x - box.size.width;
    }

    box.position = { ...newPosition };
    updateBox(box);
  };

  const updateBoxSize = (box: BoxProps, size: Size) => {
    box.size = { ...size };
    updateBox(box);
  };

  const updateBox = (box: BoxProps) => {
    if (boxList) {
      const index = boxList.findIndex((b) => b.id === box.id);

      if (index >= 0) {
        const newBoxList = _.cloneDeep(boxList);
        newBoxList[index] = box;
        setBoxList(newBoxList);
      }
    }
  };

  const onActionStart = useCallback(
    (boxId: string) => {
      resetMouseMoveAmount();
      // console.log('onActionStart', { boxId });

      if (boxList) {
        setUndoBoxList(_.cloneDeep(boxList));
      }
    },
    [boxList]
  );

  const onActionEnd = useCallback(
    (boxId: string) => {
      if (!boxList || !columnList) {
        return;
      }

      // console.log('onActionEnd', { boxId });
      const boxA = boxList?.find((b) => b.id === boxId);
      const boxB = undoBoxList?.find((b) => b.id === boxId);

      if (boxA && boxB) {
        if (mouseMoveAmount.x <= 0 && mouseMoveAmount.y <= 0) {
          setClickedBoxId(boxA.id);

          setTimeout(() => {
            setClickedBoxId(undefined);
          }, 1);
        }

        const equal = equalBoxPositionAndSize(boxA, boxB);
        const changed = !equal;

        if (changed) {
          setChangedBoxId(boxA.id);
        }

        setTimeout(() => {
          setChangedBoxId(undefined);
        }, 1);
      }
    },
    [boxList, undoBoxList, columnList]
  );

  return {
    initialized,
    boxList,
    undoBoxList,
    columnList,
    isAppModifying,
    isWindowMouseDown,
    windowWidth,
    viewportWidth,
    viewportHeight,
    selectedBoxId,
    hoveredBoxId,
    rowInterval,
    rowDiv,
    rowScale,
    cursor,
    isBoxEdge,
    currentBoxElement,
    columnContainerElement,
    step,
    boxActionMode,
    maxWidth,
    maxHeight,
    changedBoxId,
    clickedBoxId,

    setInitialized,
    setBoxList,
    setColumnList,
    setIsAppModifying,
    setSelectedBoxId,
    setHoveredBoxId,
    setRowInterval,
    setRowDiv,
    setRowScale,
    modifyData,
    setCursor,
    setIsBoxEdge,
    setCurrentBoxElement,
    setColumnContainerElement,
    setStep,

    onActionStart,
    onActionEnd,
  };
};

export const BoxAppContext = createContext<BoxAppContextType>(null);
export const useBoxApp = () => useContext(BoxAppContext)!;
