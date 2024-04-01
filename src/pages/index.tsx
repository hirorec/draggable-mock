import clsx from 'clsx';
import _ from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { BOX_LIST } from '@/const/boxList';
import { BoxApplication } from '@/features/BoxApplication';
import { DEFAULT_ROW_DIV, DEFAULT_ROW_INTERVAL } from '@/features/BoxApplication/const';
import { useBoxAppOrigin } from '@/features/BoxApplication/hooks/useBoxApp';
import { useBoxConfirmModalOrigin } from '@/features/BoxApplication/hooks/useBoxConfirmModal';
import { BoxAppProvider, BoxConfirmModalProvider } from '@/features/BoxApplication/providers';
import { BoxProps, ColumnProps } from '@/features/BoxApplication/types';

import styles from './index.module.scss';

export default function Page() {
  const boxAppOrigin = useBoxAppOrigin();
  const boxConfirmModalOrigin = useBoxConfirmModalOrigin();

  const { rowInterval, rowDiv, rowScale, setRowInterval, setRowDiv, setRowScale, boxList, setBoxList, columnList, setColumnList } = boxAppOrigin;
  const [selectedBoxListIndex, setSelectedBoxListIndex] = useState(0);
  const [rowDivTmp, setRowDivTmp] = useState(rowDiv);
  const [rowScaleTmp, setRowScaleTmp] = useState(rowScale);

  useEffect(() => {
    boxAppOrigin.setInitialized(false);
    setBoxList(BOX_LIST[selectedBoxListIndex]);
  }, [selectedBoxListIndex]);

  useEffect(() => {
    const columnList: ColumnProps[] = [
      { id: '1', label: 'column 1', rowDiv, colDiv: 1 },
      { id: '2', label: 'column 2', rowDiv, colDiv: 1 },
      { id: '3', label: 'column 3', rowDiv, colDiv: 1 },
      { id: '4', label: 'column 4', rowDiv, colDiv: 1 },
      // { id: '5', label: 'column 5', rowDiv, colDiv: 1 },
      // { id: '6', label: 'column 6', rowDiv, colDiv: 1 },
      // { id: '7', label: 'column 7', rowDiv, colDiv: 1 },
      // { id: '8', label: 'column 8', rowDiv, colDiv: 1 },
      // { id: '9', label: 'column 9', rowDiv, colDiv: 1 },
      // { id: '10', label: 'column 10', rowDiv, colDiv: 1 },
      // { id: '11', label: 'column 11', rowDiv, colDiv: 1 },
      // { id: '12', label: 'column 12', rowDiv, colDiv: 1 },
      // { id: '13', label: 'column 13', rowDiv, colDiv: 1 },
      // { id: '14', label: 'column 14', rowDiv, colDiv: 1 },
      // { id: '15', label: 'column 15', rowDiv, colDiv: 1 },
      // { id: '16', label: 'column 16', rowDiv, colDiv: 1 },
      // { id: '17', label: 'column 17', rowDiv, colDiv: 1 },
      // { id: '18', label: 'column 18', rowDiv, colDiv: 1 },
      // { id: '19', label: 'column 19', rowDiv, colDiv: 1 },
      // { id: '20', label: 'column 20', rowDiv, colDiv: 1 },
      // { id: '21', label: 'column 21', rowDiv, colDiv: 1 },
      // { id: '22', label: 'column 22', rowDiv, colDiv: 1 },
      // { id: '23', label: 'column 23', rowDiv, colDiv: 1 },
      // { id: '24', label: 'column 24', rowDiv, colDiv: 1 },
      // { id: '25', label: 'column 25', rowDiv, colDiv: 1 },
      // { id: '26', label: 'column 26', rowDiv, colDiv: 1 },
      // { id: '27', label: 'column 27', rowDiv, colDiv: 1 },
      // { id: '28', label: 'column 28', rowDiv, colDiv: 1 },
      // { id: '29', label: 'column 29', rowDiv, colDiv: 1 },
      // { id: '30', label: 'column 30', rowDiv, colDiv: 1 },
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
          };
        });

        setRowScaleTmp(rowScale);
        setBoxList(newBoxList);
      }
    }
  }, [rowScale, boxList, rowScaleTmp, setRowDivTmp]);

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
    <BoxAppProvider value={boxAppOrigin}>
      <BoxConfirmModalProvider value={boxConfirmModalOrigin}>
        <div className={clsx(styles.container)}>
          <BoxApplication onUpdateBoxList={handleUpdateBoxList} onUpdateColumnList={handleUpdateColumnList} />
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
      </BoxConfirmModalProvider>
    </BoxAppProvider>
  );
}
