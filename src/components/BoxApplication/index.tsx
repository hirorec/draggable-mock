import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';

import { BoxProps, ColumnProps } from '@/types';
import { overlapBox } from '@/utils';

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
  const maxWidth = useMemo((): number => {
    return columnList.reduce((prev, current) => {
      return prev + current.colDiv;
    }, 0);
  }, [columnList]);

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
    [boxList, columnList]
  );

  // useEffect(() => {
  //   console.log(boxList.filter((box) => box.id === '3')[0]?.position);
  // }, [boxList]);

  const handleDropBox = useCallback(
    (droppedBox: BoxProps, index: number) => {
      let newBoxList = _.cloneDeep(boxList);
      // console.log(newBoxList.filter((box) => box.id === '3')[0].position);

      newBoxList = newBoxList.map((box) => {
        const isOverlap = overlapBox(droppedBox, box);

        if (box.id === droppedBox.id) {
          box.position = {
            x: droppedBox.position.x,
            y: droppedBox.position.y,
          };
          // if (box.id === '3') {
          //   console.log(box.position);
          // }
        } else {
          if (isOverlap) {
            // const localPosition = { ...box.localPosition };
            // const position = { ...box.position };
            // // if (box.id === '3') {
            // //   console.log(box.position);
            // // }
            // localPosition.x = localPosition.x + 1;
            // box.localPosition = localPosition;
            // console.log(position, '===');
          } else {
            // const tmpBox = _.cloneDeep(box);
            // tmpBox.localPosition.x - 1;
            // const isOverlap2 = overlapBox(tmpBox, droppedBox);
            // if (!isOverlap2) {
            //   const newX = box.localPosition.x - 1;
            //   if (newX >= 0) {
            //     box.localPosition = {
            //       x: newX,
            //       y: box.localPosition.y,
            //     };
            //   }
            // }
          }
        }

        return box;
      });

      onUpdateBoxList(newBoxList);

      // const newColumnList = _.cloneDeep(columnList);

      // let tmp = 0;
      // let colIndex = -1;

      // newColumnList.forEach((col, index) => {
      //   const newTmp = tmp + col.colDiv;
      //   const res = droppedBox.position.x >= tmp && droppedBox.position.x <= newTmp;

      //   if (res) {
      //     colIndex = index;
      //   }

      //   tmp = tmp + col.colDiv;
      // });

      // if (colIndex >= 0) {
      //   newBoxList = newBoxList.map((b) => {
      //     if (b.id === droppedBox.id) {
      //       b.position = { ...droppedBox.position };
      //     } else if (b.position.x >= droppedBox.position.x) {
      //       b.position.x = b.position.x + 1;
      //     }
      //     return b;
      //   });
      //   onUpdateBoxList(newBoxList);
      //   const col = newColumnList[colIndex];
      //   col.colDiv = col.colDiv + 1;
      //   onUpdateColumnList(newColumnList);
      // }
    },
    [boxList, columnList]
  );

  return (
    <div className={clsx(styles.application)}>
      <div className={clsx(styles.applicationInner)}>
        <ColumnContainer columnList={columnList} />
        <BoxContainer
          boxList={boxList}
          columnList={columnList}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          onUpdateBox={onUpdateBox}
          onDropBox={handleDropBox}
          onUpdateBoxList={onUpdateBoxList}
          onOverlapBox={handleOverlapBox}
        />
      </div>
    </div>
  );
};
