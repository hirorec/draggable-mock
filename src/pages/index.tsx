import clsx from 'clsx';
import _ from 'lodash';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { BOX_LIST } from '@/const/boxList';
import { BoxApplication } from '@/features/BoxApplication';
import { DEFAULT_ROW_DIV, DEFAULT_ROW_INTERVAL } from '@/features/BoxApplication/const';
import { useBoxAppOrigin } from '@/features/BoxApplication/hooks/useBoxApp';
import { BoxAppProvider } from '@/features/BoxApplication/providers';
import { BoxProps, ColumnProps } from '@/features/BoxApplication/types';

import styles from './index.module.scss';

export default function Page() {
  const blockAppOrigin = useBoxAppOrigin();
  const { rowInterval, rowDiv, rowScale, setRowInterval, setRowDiv, setRowScale } = blockAppOrigin;
  const [boxList, setBoxList] = useState<BoxProps[]>();
  const [columnList, setColumnList] = useState<ColumnProps[]>();
  const [selectedBoxListIndex, setSelectedBoxListIndex] = useState(0);
  const [rowDivTmp, setRowDivTmp] = useState(rowDiv);
  const [rowScaleTmp, setRowScaleTmp] = useState(rowScale);

  useEffect(() => {
    blockAppOrigin.setInitialized(false);
    setBoxList(BOX_LIST[selectedBoxListIndex]);
  }, [selectedBoxListIndex]);

  useEffect(() => {
    const columnList: ColumnProps[] = [
      { id: '1', label: 'column 1', rowDiv, colDiv: 1 },
      { id: '2', label: 'column 2', rowDiv, colDiv: 1 },
      { id: '3', label: 'column 3', rowDiv, colDiv: 1 },
      { id: '4', label: 'column 4', rowDiv, colDiv: 1 },
      { id: '5', label: 'column 5', rowDiv, colDiv: 1 },
      { id: '6', label: 'column 6', rowDiv, colDiv: 1 },
      { id: '7', label: 'column 7', rowDiv, colDiv: 1 },
      { id: '8', label: 'column 8', rowDiv, colDiv: 1 },
      { id: '9', label: 'column 9', rowDiv, colDiv: 1 },
    ];
    setColumnList(columnList);
  }, []);

  useEffect(() => {
    const rowScale = DEFAULT_ROW_INTERVAL / rowInterval;
    const rowDiv = Math.floor(DEFAULT_ROW_DIV * rowScale);
    setRowDiv(rowDiv);
    setRowScale(rowScale);
  }, [rowInterval]);

  useEffect(() => {
    if (columnList && columnList.length) {
      if (rowDivTmp !== rowDiv) {
        const newColumnList = columnList.map((column) => {
          return {
            ...column,
            rowDiv,
          };
        });

        setRowDivTmp(rowDiv);
        setColumnList(newColumnList);
      }
    }
  }, [rowDiv, columnList, rowDivTmp, setRowDivTmp]);

  useEffect(() => {
    if (boxList && boxList.length) {
      if (rowScaleTmp !== rowScale) {
        const newBoxList: BoxProps[] = boxList?.map((box) => {
          const newBox = _.cloneDeep(box);
          box.size.width;

          return {
            ...newBox,
            // size: {
            //   width: newBox.size.width,
            //   height: newBox.size.height * rowScale,
            // },
          };
        });

        setRowScaleTmp(rowScale);
        setBoxList(newBoxList);
      }
    }
  }, [rowScale, boxList, rowScaleTmp, setRowDivTmp]);

  const handleUpdateBox = useCallback(
    (box: BoxProps, index: number) => {
      if (boxList) {
        const newBoxList = _.cloneDeep(boxList);
        newBoxList[index] = box;
        setBoxList(newBoxList);
      }
    },
    [boxList]
  );

  const handleUpdateBoxList = (boxList: BoxProps[]) => {
    setBoxList(boxList);
  };

  const handleUpdateColumnList = (columnList: ColumnProps[]) => {
    setColumnList(columnList);
  };

  const handleBoxListButton = (index: number) => {
    setSelectedBoxListIndex(index);
  };

  const handleTimeDivValueChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const el = event.currentTarget as HTMLSelectElement;
    setRowInterval(parseInt(el.value));
  };

  return (
    <BoxAppProvider value={blockAppOrigin}>
      <div className={clsx(styles.container)}>
        <BoxApplication
          boxList={boxList}
          columnList={columnList}
          maxHeight={rowDiv}
          onUpdateBox={handleUpdateBox}
          onUpdateBoxList={handleUpdateBoxList}
          onUpdateColumnList={handleUpdateColumnList}
        />
        <div className={styles.ui}>
          <div className={styles.buttons}>
            <button className={clsx(styles.button, selectedBoxListIndex === 0 && styles.selected)} onClick={() => handleBoxListButton(0)}>
              boxList 1
            </button>
            <button className={clsx(styles.button, selectedBoxListIndex === 1 && styles.selected)} onClick={() => handleBoxListButton(1)}>
              boxList 2
            </button>
            <button className={clsx(styles.button, selectedBoxListIndex === 2 && styles.selected)} onClick={() => handleBoxListButton(2)}>
              boxList 3
            </button>
          </div>
          <select className={clsx(styles.select)} onChange={handleTimeDivValueChange}>
            <option value={5}>5分</option>
            <option value={10}>10分</option>
            <option value={15}>15分</option>
            <option value={20}>20分</option>
          </select>
        </div>
      </div>
    </BoxAppProvider>
  );
}
