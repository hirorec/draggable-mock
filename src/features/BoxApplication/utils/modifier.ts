import _ from 'lodash';

import { BoxProps, ColumnProps } from '../types';

import { yInBox, positionInBoxWithBoxLocalX } from '.';

const LOG_ENABLED = false;

export const modifyData = async (
  boxList: BoxProps[],
  columnList: ColumnProps[],
  updatedBox?: BoxProps,
  selectedBoxId?: string
): Promise<{
  boxList: BoxProps[];
  columnList: ColumnProps[];
}> => {
  // 操作boxの新しいcolIndexセット
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

  // y軸でソート
  boxList.sort((a, b) => {
    if (a.position.y > b.position.y) {
      return 1;
    }

    if (a.position.y < b.position.y) {
      return -1;
    }

    return 0;
  });

  // リセット処理
  reset(boxList, columnList, selectedBoxId);

  // カラム分割設定
  modifyColumns(boxList, columnList);

  // Boxポジション設定
  modifyBoxPositions(boxList, columnList);

  return {
    boxList,
    columnList,
  };
};

/*
  reset
 */
const reset = (boxList: BoxProps[], columnList: ColumnProps[], selectedBoxId?: string) => {
  boxList.forEach((box) => {
    box.localPosition.x = 0;
  });
  columnList.forEach((col) => {
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
};

/*
  カラム分割設定
  重なり判定処理したうえで列ごとの分割数を調整する
 */
const modifyColumns = (boxList: BoxProps[], columnList: ColumnProps[]) => {
  columnList.forEach((col, index) => {
    const boxListInCol = boxList.filter((box) => {
      return box.colIndex === index;
    });

    const rowOverlapCounts = new Array(col.rowDiv).fill({}).map((_, y) => {
      const rowOverlapCount = boxListInCol.reduce((prev, current) => {
        const isOverlap = yInBox(y, current);
        return prev + (isOverlap ? 1 : 0);
      }, 0);

      return Math.max(rowOverlapCount - 1, 0);
    });

    const maxRowOverlapCount = _.max(rowOverlapCounts) || 0;
    columnList[index].colDiv = maxRowOverlapCount + 1;
    return col;
  });
};

/*
  Boxポジション設定
 */
const modifyBoxPositions = (boxList: BoxProps[], columnList: ColumnProps[]) => {
  let x1 = 0;
  columnList.forEach(async (col, index) => {
    const boxListInCol = boxList.filter((box) => {
      return box.colIndex === index;
    });

    for (let i = 0; i < col.colDiv; i++) {
      boxListInCol.forEach((box) => {
        box.position.x = x1 - col.colDiv + 1;
      });

      x1++;
    }

    boxListInCol.forEach(async (box, j) => {
      if (j <= 0) {
        return;
      }

      if (LOG_ENABLED) {
        console.groupEnd();
        console.group(`box ${box.id}`);
      }

      let x = box.position.x;
      let loop = true;

      while (loop) {
        if (LOG_ENABLED) {
          console.group(`x ${x}`);
        }

        let hasOverlap = false;

        new Array(box.size.height).fill({}).forEach((_, boxRow) => {
          if (LOG_ENABLED) {
            console.group(`row ${boxRow}`);
          }

          const y = box.position.y + boxRow;
          const boxTargets = [...boxListInCol].slice(0, j);
          hasOverlap =
            hasOverlap ||
            boxTargets.some((targetBox) => {
              if (box.id === targetBox.id) {
                return false;
              }
              if (LOG_ENABLED) {
                console.log({ targetBox: targetBox.id }, targetBox.position);
              }

              return positionInBoxWithBoxLocalX({ x, y }, targetBox);
            });

          if (LOG_ENABLED) {
            console.log({ x, y, hasOverlap });
            console.groupEnd();
          }
        });

        if (hasOverlap) {
          box.localPosition.x += 1;
        } else {
          loop = false;
          if (LOG_ENABLED) {
            console.groupEnd();
          }

          return;
        }

        x++;

        if (LOG_ENABLED) {
          console.log({ hasOverlap }, 'box.localPosition.x:', box.localPosition.x);
          console.groupEnd();
        }
      }
    });
  });
};
