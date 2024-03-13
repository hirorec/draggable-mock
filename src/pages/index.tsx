import clsx from 'clsx';
import _ from 'lodash';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { BOX_LIST } from '@/const/boxList';
import { BoxApplication } from '@/features/BoxApplication';
import { BoxAppProvider, useBoxAppOrigin } from '@/features/BoxApplication/hooks/useBoxApp';
import { BoxProps, ColumnProps } from '@/features/BoxApplication/types';

import styles from './index.module.scss';

export default function Page() {
  const blockAppOrigin = useBoxAppOrigin();
  const [boxList, setBoxList] = useState<BoxProps[]>(BOX_LIST[0]);
  const [columnList, setColumnList] = useState<ColumnProps[]>();
  const [selectedBoxListIndex, setSelectedBoxListIndex] = useState(0);
  const rowDiv = 15;

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
    console.log(el.value);
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
            <option value={1}>5分</option>
            <option value={2}>10分</option>
            <option value={3}>15分</option>
            <option value={4}>20分</option>
          </select>
        </div>
      </div>
    </BoxAppProvider>
  );
}
