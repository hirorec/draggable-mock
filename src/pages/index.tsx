import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { BoxApplication } from '@/components/BoxApplication';
import { BoxProps, ColumnProps } from '@/types';

import styles from './index.module.scss';

export default function Page() {
  const [boxList, setBoxList] = useState<BoxProps[]>();
  const [columnList, setColumnList] = useState<ColumnProps[]>();
  const rowDiv = 30;

  useEffect(() => {
    const boxList: BoxProps[] = [
      {
        id: '1-1',
        colIndex: 0,
        backgroundColor: '#FFE4BF',
        borderColor: '#F2A455',
        label: `Draggable\nBox1-1`,
        position: {
          x: 0,
          y: 0,
        },
        localPosition: {
          x: 0,
          y: 0,
        },
        size: {
          width: 1,
          height: 2,
        },
        zIndex: 0,
      },
      {
        id: '1-2',
        colIndex: 0,
        backgroundColor: '#FFE4BF',
        borderColor: '#F2A455',
        label: `Draggable\nBox1-2`,
        position: {
          x: 0,
          y: 2,
        },
        localPosition: {
          x: 0,
          y: 0,
        },
        size: {
          width: 1,
          height: 3,
        },
        zIndex: 0,
      },
      {
        id: '1-3',
        colIndex: 0,
        backgroundColor: '#FFE4BF',
        borderColor: '#F2A455',
        label: `Draggable\nBox1-3`,
        position: {
          x: 0,
          y: 5,
        },
        localPosition: {
          x: 0,
          y: 0,
        },
        size: {
          width: 1,
          height: 3,
        },
        zIndex: 0,
      },
      {
        id: '2-0',
        colIndex: 1,
        backgroundColor: '#E6F7DA',
        borderColor: '#93ED6F',
        label: `Draggable\nBox2-0`,
        position: {
          x: 1,
          y: 0,
        },
        localPosition: {
          x: 0,
          y: 0,
        },
        size: {
          width: 1,
          height: 3,
        },
        zIndex: 0,
      },
      {
        id: '2-1',
        colIndex: 1,
        backgroundColor: '#E6F7DA',
        borderColor: '#93ED6F',
        label: `Draggable\nBox2-1`,
        position: {
          x: 1,
          y: 1,
        },
        localPosition: {
          x: 0,
          y: 0,
        },
        size: {
          width: 1,
          height: 4,
        },
        zIndex: 0,
      },
      {
        id: '2-2',
        colIndex: 1,
        backgroundColor: '#E6F7DA',
        borderColor: '#93ED6F',
        label: `Draggable\nBox2-2`,
        position: {
          x: 1,
          y: 5,
        },
        localPosition: {
          x: 0,
          y: 0,
        },
        size: {
          width: 1,
          height: 5,
        },
        zIndex: 0,
      },
      {
        id: '4',
        colIndex: 3,
        backgroundColor: '#FFE4BF',
        borderColor: '#F2A455',
        label: `Draggable\nBox4`,
        position: {
          x: 2,
          y: 0,
        },
        localPosition: {
          x: 0,
          y: 0,
        },
        size: {
          width: 1,
          height: 15,
        },
        zIndex: 0,
      },
      {
        id: '5',
        colIndex: 4,
        backgroundColor: '#FFE4BF',
        borderColor: '#F2A455',
        label: `Draggable\nBox5`,
        position: {
          x: 3,
          y: 1,
        },
        localPosition: {
          x: 0,
          y: 0,
        },
        size: {
          width: 1,
          height: 5,
        },
        zIndex: 0,
      },
    ];
    setBoxList(boxList);
  }, []);

  useEffect(() => {
    const columnList: ColumnProps[] = [
      { id: '1', label: 'column 1', rowDiv, colDiv: 1 },
      { id: '2', label: 'column 2', rowDiv, colDiv: 1 },
      { id: '3', label: 'column 3', rowDiv, colDiv: 1 },
      { id: '4', label: 'column 4', rowDiv, colDiv: 1 },
      { id: '5', label: 'column 5', rowDiv, colDiv: 1 },
      // { id: '6', label: 'column 6', rowDiv, colDiv: 1 },
      // { id: '7', label: 'column 7', rowDiv, colDiv: 1 },
      // { id: '8', label: 'column 8', rowDiv, colDiv: 1 },
      // { id: '9', label: 'column 9', rowDiv, colDiv: 1 },
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
    // console.log(boxList);
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
