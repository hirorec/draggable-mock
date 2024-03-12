import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BoxAppProvider, useBoxAppOrigin } from '@/features/BoxApplication/hooks/useBoxApp';
import { BoxProps, ColumnProps } from '@/features/BoxApplication/types';
import { overlapBox, sleep } from '@/features/BoxApplication/utils';

import { BoxContainer } from './components/BoxContainer';
import { ColumnContainer } from './components/ColumnContainer';
import { ColumnHeader } from './components/ColumnHeader';
import { ColumnRowHeader } from './components/ColumnRowHeader';
import styles from './index.module.scss';

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

      let newBoxList = _.cloneDeep(boxList);
      const newColumnList = _.cloneDeep(columnList);

      newBoxList[index] = {
        ...newBoxList[index],
        position: {
          x: droppedBox.position.x + droppedBox.localPosition.x,
          y: droppedBox.position.y,
        },
      };

      const { boxList: modifiedBoxList, columnList: modifiedColumnList } = await modifyData(newBoxList, newColumnList, droppedBox);
      onUpdateBoxList(modifiedBoxList);
      onUpdateColumnList(modifiedColumnList);
    },
    [boxList, columnList, isAppModifying, selectedBoxId, initialized]
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

    console.log('modifyData');
    setIsAppModifying(true);

    //-----------------------------
    // 操作boxの新しいcolIndexセット
    //-----------------------------
    if (updatedBox) {
      let x = 0;
      const updatedBoxIndex = boxList.findIndex((box) => box.id === updatedBox.id);

      columnList.forEach((col, index) => {
        for (let i = 0; i < col.colDiv; i++) {
          if (boxList[updatedBoxIndex].position.x === x) {
            boxList[updatedBoxIndex].position.x = x - col.colDiv;
            boxList[updatedBoxIndex].colIndex = index;
          }

          x++;
        }
      });
    }

    //-----------------------------
    // reset
    //-----------------------------
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

    //-----------------------------
    // 重なり判定
    //-----------------------------
    const overlappedBoxData: string[][] = [];

    columnList.forEach((col, index) => {
      let overLapCount = 0;
      const overlappedIds: string[] = [];

      const boxInColList = boxList.filter((box) => {
        return box.colIndex === index;
      });

      boxInColList.forEach((boxA) => {
        boxInColList.forEach((boxB) => {
          if (boxB.id !== boxA.id) {
            const boxAClone = _.clone(boxA);
            const boxBClone = _.clone(boxB);

            if (initialized) {
              boxAClone.position.x = 0;
              boxBClone.position.x = 0;
            }

            const isOverlap = overlapBox(boxBClone, boxAClone);

            if (isOverlap) {
              overlappedIds.push(boxA.id, boxB.id);
            }
          }
        });
      });

      columnList[index].colDiv = overLapCount + 1;

      const ids = _.uniq(overlappedIds);
      overlappedBoxData.push(ids);
      columnList[index].colDiv = Math.max(ids.length, 1);
      return col;
    });

    console.log('overlappedBoxData', overlappedBoxData);

    //-----------------------------
    // ポジション設定
    //-----------------------------
    let x = 0;
    columnList.forEach((col, index) => {
      const boxListInCol = boxList.filter((box) => {
        return box.colIndex === index;
      });

      for (let i = 0; i < col.colDiv; i++) {
        boxListInCol.forEach((box) => {
          box.position.x = x - col.colDiv + 1;

          const overlappedBoxItem = overlappedBoxData[index];

          if (overlappedBoxItem.includes(box.id)) {
            box.size.width = 1;
          } else {
            box.size.width = col.colDiv;
          }
        });

        x++;
      }
    });

    // ローカルポジション設定
    overlappedBoxData.forEach((ids) => {
      const sortedIds = ids.sort((a, b) => {
        const boxA = boxList.find((box) => box.id === a);
        const boxB = boxList.find((box) => box.id === b);

        if (!boxA || !boxB) {
          return 0;
        }

        if (boxA.position.y < boxB.position.y) {
          return -1;
        } else if (boxA.position.y > boxB.position.y) {
          return 1;
        }

        return 0;
      });

      for (let i = 1; i < sortedIds.length; i++) {
        const id = sortedIds[i];
        const box = boxList.find((b) => b.id === id);

        if (box) {
          box.localPosition.x = i;
        }
      }
    });

    await sleep(0);
    setIsAppModifying(false);
    // console.log(boxList, columnList);
    return {
      boxList,
      columnList,
    };
  };

  return (
    <div className={clsx(styles.application)}>
      <div className={clsx(styles.applicationInner)}>
        <BoxAppProvider value={blockAppOrigin}>
          <ColumnHeader columnList={columnList || []} />
          <ColumnRowHeader columnList={columnList || []} />
          <ColumnContainer columnList={columnList || []}>
            <BoxContainer
              boxList={boxList || []}
              columnList={columnList || []}
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
