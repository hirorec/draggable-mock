import clsx from 'clsx';
import _ from 'lodash';
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
      let newBoxList = _.cloneDeep(boxList);
      const newColumnList = _.cloneDeep(columnList);

      let tmp = 0;
      let colIndex = -1;

      newColumnList.forEach((col, index) => {
        const newTmp = tmp + col.colDiv;
        const res = box.position.x >= tmp && box.position.x <= newTmp;

        if (res) {
          colIndex = index;
        }

        tmp = tmp + col.colDiv;
      });

      if (colIndex >= 0) {
        newBoxList = newBoxList.map((b) => {
          if (b.id === box.id) {
            b.position = { ...box.position };
          } else if (b.position.x >= box.position.x) {
            b.position.x = b.position.x + 1;
          }

          return b;
        });

        onUpdateBoxList(newBoxList);

        const col = newColumnList[colIndex];
        col.colDiv = col.colDiv + 1;
        onUpdateColumnList(newColumnList);
      }
    },
    [columnList, boxList]
  );

  return (
    <div className={clsx(styles.application)}>
      <div className={clsx(styles.applicationInner)}>
        <ColumnContainer columnList={columnList} />
        <BoxContainer
          boxList={boxList}
          columnList={columnList}
          maxHeight={maxHeight}
          onUpdateBox={onUpdateBox}
          onUpdateBoxList={onUpdateBoxList}
          onOverlapBox={handleOverlapBox}
        />
      </div>
    </div>
  );
};
