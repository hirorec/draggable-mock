import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { BOX_LIST } from '@/const/boxList';
import { BoxApplication } from '@/features/BoxApplication';
import { BoxProps, ColumnProps } from '@/features/BoxApplication/types';

import styles from './index.module.scss';

export default function Page() {
  const [boxList, setBoxList] = useState<BoxProps[]>();
  const [columnList, setColumnList] = useState<ColumnProps[]>();
  const rowDiv = 30;

  useEffect(() => {
    setBoxList(BOX_LIST);
  }, []);

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

  return (
    <div className={clsx(styles.container)}>
      <BoxApplication
        boxList={boxList}
        columnList={columnList}
        maxHeight={rowDiv}
        onUpdateBox={handleUpdateBox}
        onUpdateBoxList={handleUpdateBoxList}
        onUpdateColumnList={handleUpdateColumnList}
      />
    </div>
  );
}
