import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BoxAppProvider, useBoxAppOrigin } from '@/hooks/useBoxApp';
import { BoxProps, ColumnProps } from '@/types';
import { overlapBox, sleep } from '@/utils';

import styles from './index.module.scss';
import { BoxContainer } from '../BoxContainer';
import { ColumnContainer } from '../ColumnContainer';

type Props = {
  boxList?: BoxProps[];
  columnList?: ColumnProps[];
  maxHeight: number;
  onUpdateBox: (box: BoxProps, index: number) => void;
  onUpdateBoxList: (boxList: BoxProps[]) => void;
  onUpdateColumnList: (columnList: ColumnProps[]) => void;
};

export const BoxApplication: React.FC<Props> = ({ boxList, columnList, maxHeight, onUpdateBox, onUpdateBoxList, onUpdateColumnList }) => {
  const blockAppOrigin = useBoxAppOrigin();
  const [initialized, setInitialized] = useState(false);
  const { isAppModifying, setIsAppModifying, selectedBoxId } = blockAppOrigin;

  const maxWidth = useMemo((): number => {
    return (
      columnList?.reduce((prev, current) => {
        return prev + current.colDiv;
      }, 0) || 0
    );
  }, [columnList]);

  useEffect(() => {
    if (!initialized && boxList && columnList) {
      (async () => {
        const newBoxList = _.cloneDeep(boxList);
        const newColumnList = _.cloneDeep(columnList);
        const { boxList: modifiedBoxList, columnList: modifiedColumnList } = await modifyData(newBoxList, newColumnList);
        onUpdateBoxList(modifiedBoxList);
        onUpdateColumnList(modifiedColumnList);
        setInitialized(true);
      })();
    }
  }, [initialized, isAppModifying, boxList, columnList]);

  const handleUpdateBoxSizeEnd = useCallback(
    async (resizedBox: BoxProps) => {
      if (!boxList || !columnList) {
        return;
      }

      console.log('handleUpdateBoxSizeEnd');
      const newBoxList = _.cloneDeep(boxList);
      const newColumnList = _.cloneDeep(columnList);
      const { boxList: modifiedBoxData, columnList: modifiedColumnList } = await modifyData(newBoxList, newColumnList, resizedBox);
      onUpdateBoxList(modifiedBoxData);
      onUpdateColumnList(modifiedColumnList);
    },
    [boxList, columnList, isAppModifying]
  );

  const handleDropBox = useCallback(
    async (droppedBox: BoxProps, index: number) => {
      if (!boxList || !columnList) {
        return;
      }

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
    },
    [boxList, columnList, isAppModifying, selectedBoxId]
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

    console.log('modifyData', { selectedBoxId });
    setIsAppModifying(true);

    // 操作boxの新しいcolIndexセット
    const selectedBoxIndex = boxList.findIndex((box) => {
      return box.id === updatedBox?.id;
    });

    if (updatedBox && selectedBoxIndex >= 0) {
      let x = 0;

      const selectedBox = boxList[selectedBoxIndex];

      if (selectedBox) {
        columnList.forEach((col, index) => {
          for (let i = 0; i < col.colDiv; i++) {
            if (updatedBox.position.x === x) {
              boxList[selectedBoxIndex].colIndex = index;
              console.log({ newColIndex: index });
            }

            x++;
          }
        });
      }
    }

    // reset
    boxList.forEach((box) => {
      box.localPosition.x = 0;
    });
    columnList.forEach((col, index) => {
      col.colDiv = 1;
    });
    columnList.forEach((_, index) => {
      const boxListInCol = boxList.filter((box) => {
        return box.colIndex === index;
      });

      boxListInCol.forEach((box) => {
        if (box.id !== selectedBoxId) {
          const boxIndex = boxList.findIndex((b) => b.id === box.id);

          if (boxIndex >= 0) {
            boxList[boxIndex].position.x = index;
          }
        }
      });
    });

    const overlappedBoxData: { id: string; overLapCount: number; ids: string[] }[] = [];

    columnList.forEach((col, index) => {
      let overLapCount = 0;

      const boxInColList = boxList.filter((box) => {
        return box.colIndex === index;
      });

      boxInColList.forEach((boxA) => {
        boxInColList.forEach((boxB) => {
          if (boxB.id !== boxA.id) {
            const isOverlap = overlapBox(boxB, boxA);
            const foundOverlappedItem = overlappedBoxData.find((item) => {
              return item.ids.includes(boxA.id) && item.ids.includes(boxB.id);
            });
            // console.log(boxA, boxB);
            if (isOverlap && !foundOverlappedItem) {
              overLapCount += 1;
              overlappedBoxData.push({ id: boxA.id, overLapCount, ids: [boxA.id, boxB.id] });
            }
          }
        });
      });

      columnList[index].colDiv = overLapCount + 1;
      console.log({ colIndex: index, overLapCount });
      return col;
    });

    console.log('overlappedBoxData', overlappedBoxData);

    let x = 0;

    columnList.forEach((col, index) => {
      const boxListInCol = boxList.filter((box) => {
        return box.colIndex === index;
      });

      for (let i = 0; i < col.colDiv; i++) {
        boxListInCol.forEach((box) => {
          // const foundBox = overlappedBoxData.find((item) => item.id === box.id);
          // console.log(box);
          // if (box.id !== selectedBoxId && !foundBox) {
          //   box.position.x = x;
          // }
          // console.log(x);
          box.position.x = x - col.colDiv + 1;
        });

        x++;
      }
    });

    overlappedBoxData.forEach((item) => {
      const overlapBoxIndex = boxList.findIndex((box) => box.id === item.id);

      if (overlapBoxIndex >= 0) {
        boxList[overlapBoxIndex].localPosition.x = item.overLapCount;
      }
    });

    await sleep(100);
    setIsAppModifying(false);

    console.log(boxList, columnList);
    return {
      boxList,
      columnList,
    };
  };

  return (
    <div className={clsx(styles.application)}>
      <div className={clsx(styles.applicationInner)}>
        <BoxAppProvider value={blockAppOrigin}>
          <ColumnContainer columnList={columnList || []}>
            <BoxContainer
              boxList={boxList || []}
              maxWidth={maxWidth}
              maxHeight={maxHeight}
              onUpdateBox={onUpdateBox}
              onDropBox={handleDropBox}
              onUpdateBoxSizeEnd={handleUpdateBoxSizeEnd}
            />
          </ColumnContainer>
        </BoxAppProvider>
      </div>
    </div>
  );
};
