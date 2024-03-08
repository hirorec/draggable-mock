import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
  const [isMouseDown, setIsMouseDown] = useState(false);

  const maxWidth = useMemo((): number => {
    return columnList.reduce((prev, current) => {
      return prev + current.colDiv;
    }, 0);
  }, [columnList]);

  useEffect(() => {
    const onMouseDown = () => {
      setIsMouseDown(true);
    };
    const onMouseUp = () => {
      setIsMouseDown(false);
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleUpdateBoxSizeEnd = useCallback(
    (resizedBox: BoxProps) => {
      console.log('handleUpdateBoxSizeEnd');
      const newBoxList = _.cloneDeep(boxList);
      const newColumnList = _.cloneDeep(columnList);
      const { boxList: modifiedBoxData, columnList: modifiedColumnList } = modifyData(newBoxList, newColumnList, resizedBox);
      onUpdateBoxList(modifiedBoxData);
      onUpdateColumnList(modifiedColumnList);
    },
    [boxList, columnList]
  );

  const handleDropBox = useCallback(
    (droppedBox: BoxProps, index: number) => {
      console.log('handleDropBox');
      const newBoxList = _.cloneDeep(boxList);
      const newColumnList = _.cloneDeep(columnList);

      newBoxList[index].position = {
        x: droppedBox.position.x,
        y: droppedBox.position.y,
      };

      const { boxList: modifiedBoxData, columnList: modifiedColumnList } = modifyData(newBoxList, newColumnList, droppedBox);
      onUpdateBoxList(modifiedBoxData);
      onUpdateColumnList(modifiedColumnList);
    },
    [boxList, columnList]
  );

  const modifyData = (
    boxList: BoxProps[],
    columnList: ColumnProps[],
    updatedBox?: BoxProps
  ): {
    boxList: BoxProps[];
    columnList: ColumnProps[];
  } => {
    console.log('modifyData');

    boxList.forEach((box) => {
      if (box.id === updatedBox?.id) {
        box.zIndex = 1;
      } else {
        box.zIndex = 0;
      }
    });

    const getColIndex = (x: number) => {
      let count = 0;
      let colIndex = -1;

      columnList.forEach((col, i) => {
        for (let j = 0; j < col.colDiv; j++) {
          if (count === x) {
            colIndex = i;
          }
          count++;
        }
      });

      return colIndex;
    };

    columnList.forEach((col, index) => {
      let overLapCount = 0;

      const boxInColList = boxList.filter((box) => {
        return box.position.x === index;
      });

      boxInColList.forEach((boxA) => {
        boxInColList.forEach((boxB) => {
          let conditions = boxB.id !== boxA.id;

          if (updatedBox) {
            conditions = conditions && boxA.id !== updatedBox.id;
          }

          if (conditions) {
            const isOverlap = overlapBox(boxB, boxA);
            const boxIndex = boxList.findIndex((box) => {
              return box.id === boxA.id;
            });

            if (isOverlap) {
              overLapCount += 1;
              // boxList[boxIndex].localPosition.x = overLapCount;
            } else {
              // if (boxList[boxIndex].localPosition.x > 0) {
              //   boxList[boxIndex].localPosition.x -= 1;
              // }
            }
          }
        });
      });

      console.log({ colIndex: index, overLapCount });
      columnList[index].colDiv = overLapCount + 1;

      return col;
    });

    // const newBoxList = _.cloneDeep(boxList);

    // const getColIndex = (x: number, columnList: ColumnProps[]) => {
    //   let count = 0;
    //   let colIndex = -1;

    //   columnList.forEach((col, i) => {
    //     for (let j = 0; j < col.colDiv; j++) {
    //       if (count === x) {
    //         colIndex = i;
    //       }
    //       count++;
    //     }
    //   });

    //   return colIndex;
    // };

    // newBoxList.forEach((box, index) => {
    //   let globalX = box.position.x;

    //   const dx = getColIndex(box.position.x, columnList) - getColIndex(box.position.x, newColumnList);
    //   globalX += dx;

    //   newBoxList[index].position = {
    //     x: globalX,
    //     y: box.position.y,
    //   };
    // });

    return {
      boxList,
      columnList,
    };
  };

  return (
    <div className={clsx(styles.application)}>
      <div className={clsx(styles.applicationInner)}>
        <ColumnContainer columnList={columnList}>
          <BoxContainer
            boxList={boxList}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            isMouseDown={isMouseDown}
            onUpdateBox={onUpdateBox}
            onDropBox={handleDropBox}
            onUpdateBoxSizeEnd={handleUpdateBoxSizeEnd}
          />
        </ColumnContainer>
      </div>
    </div>
  );
};
