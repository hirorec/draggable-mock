import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BlockAppProvider, useBlockAppOrigin } from '@/hooks/useBlockApp';
import { BoxProps, ColumnProps } from '@/types';
import { overlapBox, sleep } from '@/utils';

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
  const blockAppOrigin = useBlockAppOrigin();
  const { isAppModifying, setIsAppModifying } = blockAppOrigin;
  const [isMouseDown, setIsMouseDown] = useState(false);
  // const [isAppModifying, setIsAppModifying] = useState(false);

  const maxWidth = useMemo((): number => {
    return columnList.reduce((prev, current) => {
      return prev + current.colDiv;
    }, 0);
  }, [columnList]);

  // useEffect(() => {
  //   const onMouseDown = () => {
  //     setIsMouseDown(true);
  //   };
  //   const onMouseUp = () => {
  //     setIsMouseDown(false);
  //   };

  //   window.addEventListener('mousedown', onMouseDown);
  //   window.addEventListener('mouseup', onMouseUp);

  //   return () => {
  //     window.removeEventListener('mousedown', onMouseDown);
  //     window.removeEventListener('mouseup', onMouseUp);
  //   };
  // }, []);

  useEffect(() => {
    console.log({ isAppModifying });
  }, [isAppModifying]);

  const handleUpdateBoxSizeEnd = useCallback(
    async (resizedBox: BoxProps) => {
      setIsAppModifying(true);
      console.log('handleUpdateBoxSizeEnd');
      const newBoxList = _.cloneDeep(boxList);
      const newColumnList = _.cloneDeep(columnList);
      const { boxList: modifiedBoxData, columnList: modifiedColumnList } = await modifyData(newBoxList, newColumnList, resizedBox);
      onUpdateBoxList(modifiedBoxData);
      onUpdateColumnList(modifiedColumnList);
      setIsAppModifying(false);
    },
    [boxList, columnList, isAppModifying]
  );

  const handleDropBox = useCallback(
    async (droppedBox: BoxProps, index: number) => {
      // setIsAppModifying(true);
      console.log('handleDropBox');
      const newBoxList = _.cloneDeep(boxList);
      const newColumnList = _.cloneDeep(columnList);

      newBoxList[index].position = {
        x: droppedBox.position.x,
        y: droppedBox.position.y,
      };

      const { boxList: modifiedBoxList, columnList: modifiedColumnList } = await modifyData(newBoxList, newColumnList, droppedBox);
      onUpdateBoxList(modifiedBoxList);
      onUpdateColumnList(modifiedColumnList);

      await sleep(100);
      setIsAppModifying(false);
      console.log('=========');
    },
    [boxList, columnList, isAppModifying]
  );

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

    console.log('modifyData', { isAppModifying });
    setIsAppModifying(true);

    await sleep(100);

    // boxList.forEach((box) => {
    //   if (box.id === updatedBox?.id) {
    //     box.zIndex = 1;
    //   } else {
    //     box.zIndex = 0;
    //   }
    // });

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

    const overlappedBoxIndices: number[] = [];

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
              overlappedBoxIndices.push(boxIndex);
            } else {
              // if (boxList[boxIndex].localPosition.x > 0) {
              //   boxList[boxIndex].localPosition.x -= 1;
              // }
            }
          }
        });
      });

      columnList[index].colDiv = overLapCount + 1;

      return col;
    });

    let x = 0;

    columnList.forEach((col, index) => {
      for (let i = 0; i < col.colDiv; i++) {
        // console.log({ x, index });

        const boxListInCol = boxList.filter((box) => {
          return box.colIndex === index;
        });

        boxListInCol.forEach((box) => {
          // const boxIndex = boxList.findIndex((box2) => box2.id === box.id);
          // boxList[boxIndex].position.x = x;
          if (box.id !== updatedBox?.id) {
            // _.cloneDeep(box).position.x = x;
            box.position.x = 0;
          }
        });

        x++;
      }
    });

    // console.log({ overlappedBoxIndices });

    // boxList.forEach((box, index) => {
    //   if (overlappedBoxIndices.includes(index)) {
    //     box.localPosition.x = 1;
    //   } else {
    //     box.localPosition.x = 0;
    //   }
    // });

    // boxList.forEach((box, index) => {
    //   let globalX = getColIndex(box.position.x);
    //   console.log(box, { globalX });

    //   // boxList[index].position = {
    //   //   x: globalX,
    //   //   y: box.position.y,
    //   // };
    // });

    setIsAppModifying(false);

    return {
      // boxList: _.cloneDeep(boxList),
      boxList,
      columnList,
    };
  };

  return (
    <div className={clsx(styles.application)}>
      <div className={clsx(styles.applicationInner)}>
        <BlockAppProvider value={blockAppOrigin}>
          <ColumnContainer columnList={columnList}>
            <BoxContainer
              isAppModifying={isAppModifying}
              boxList={boxList}
              maxWidth={maxWidth}
              maxHeight={maxHeight}
              isMouseDown={isMouseDown}
              onUpdateBox={onUpdateBox}
              onDropBox={handleDropBox}
              onUpdateBoxSizeEnd={handleUpdateBoxSizeEnd}
            />
          </ColumnContainer>
        </BlockAppProvider>
      </div>
    </div>
  );
};
