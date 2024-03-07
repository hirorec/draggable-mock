import clsx from 'clsx';
import React, { useCallback } from 'react';

import { BoxProps, ColumnProps } from '@/types';

import styles from './index.module.scss';
import { BoxContainer } from '../BoxContainer';
import { ColumnContainer } from '../ColumnContainer';

type Props = {
  boxList: BoxProps[];
  columnList: ColumnProps[];
  maxHeight: number;
  onUpdateBox: (box: BoxProps, index: number) => void;
  onUpdateBoxList: (boxList: BoxProps[]) => void;
  onUpdateColumnList: (columnList: ColumnProps[]) => void;
};

export const BoxApplication: React.FC<Props> = ({ boxList, columnList, maxHeight, onUpdateBox, onUpdateBoxList, onUpdateColumnList }) => {
  const handleOverlapBox = useCallback(
    (box: BoxProps) => {
      let tmp = 0;
      let colIndex = -1;

      columnList.forEach((col, index) => {
        const newTmp = tmp + col.colDiv;
        const res = box.position.x >= tmp && box.position.x <= newTmp;

        if (res) {
          colIndex = index;
        }

        tmp = tmp + col.colDiv;
      });

      if (colIndex >= 0) {
        console.log({ colIndex });
      }
    },
    [columnList, boxList]
  );

  return (
    <div className={clsx(styles.application)}>
      <div className={clsx(styles.applicationInner)}>
        <ColumnContainer columnList={columnList} />
        <BoxContainer boxList={boxList} maxHeight={maxHeight} onUpdateBox={onUpdateBox} onOverlapBox={handleOverlapBox} />
      </div>
    </div>
  );
};
