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

  // const handleOverlapBox = useCallback(
  //   (box: BoxProps) => {
  //     let newBoxList = _.cloneDeep(boxList);
  //     const newColumnList = _.cloneDeep(columnList);

  //     let tmp = 0;
  //     let colIndex = -1;

  //     newColumnList.forEach((col, index) => {
  //       const newTmp = tmp + col.colDiv;
  //       const res = box.position.x >= tmp && box.position.x <= newTmp;

  //       if (res) {
  //         colIndex = index;
  //       }

  //       tmp = tmp + col.colDiv;
  //     });

  //     if (colIndex >= 0) {
  //       newBoxList = newBoxList.map((b) => {
  //         if (b.id === box.id) {
  //           b.position = { ...box.position };
  //         } else if (b.position.x >= box.position.x) {
  //           b.position.x = b.position.x + 1;
  //         }

  //         return b;
  //       });

  //       onUpdateBoxList(newBoxList);

  //       const col = newColumnList[colIndex];
  //       col.colDiv = col.colDiv + 1;
  //       onUpdateColumnList(newColumnList);
  //     }
  //   },
  //   [boxList, columnList]
  // );

  // useEffect(() => {
  //   console.log(boxList.filter((box) => box.id === '3')[0]?.position);
  // }, [boxList]);

  useEffect(() => {
    // console.log('---');
  }, [columnList]);

  const handleDropBox = useCallback(
    (droppedBox: BoxProps, index: number) => {
      const newBoxList = _.cloneDeep(boxList);
      const tempBox = _.cloneDeep(newBoxList[index]);

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

      // const boxColIndex = getColIndex(droppedBox.position.x);
      // console.log({ boxColIndex });

      newBoxList[index].position = {
        x: droppedBox.position.x,
        y: droppedBox.position.y,
      };

      const newColumnList = _.cloneDeep(columnList);

      columnList.forEach((col, index) => {
        let overLapCount = 0;

        const boxInColList = newBoxList.filter((box) => {
          return box.position.x === index;
        });

        // console.log({ boxInColList });

        boxInColList.forEach((boxA) => {
          boxInColList.forEach((boxB) => {
            if (boxB.id !== boxA.id && boxA.id !== droppedBox.id) {
              const isOverlap = overlapBox(boxA, boxB);

              if (isOverlap) {
                overLapCount += 1;
                console.log({ isOverlap, overLapCount });
                const boxIndex = newBoxList.findIndex((box) => {
                  return box.id === boxA.id;
                });

                newBoxList[boxIndex].localPosition.x = overLapCount;
                // console.log(newBoxList[boxIndex].id, newBoxList[boxIndex].localPosition.x);
                // console.log({ isOverlap, overLapCount, boxIndex }, newBoxList[boxIndex].id, newBoxList[boxIndex].localPosition.x);
              } else {
                // const boxIndex = newBoxList.findIndex((box) => {
                //   return box.id === boxA.id;
                // });
                // if (newBoxList[boxIndex].localPosition.x > 0) {
                //   newBoxList[boxIndex].localPosition.x -= 1;
                // }
              }
            }
          });
        });

        // console.log({ overLapCount });
        newColumnList[index].colDiv = overLapCount + 1;

        // for (let i = 0; i < newColumnList[index].colDiv; i++) {
        //   console.log(index, i);
        // }

        // for (let i = 0; i < col.colDiv; i++) {
        //   const boxInColDivList = newBoxList.filter((box) => {
        //     return box.position.x === index && box.localPosition.x === i;
        //   });
        //   // console.log({ boxInColDivList }, i);

        //   boxInColDivList.forEach((boxA) => {
        //     boxInColDivList.forEach((boxB) => {
        //       if (boxB.id !== boxA.id && boxA.id !== droppedBox.id) {
        //         const isOverlap = overlapBox(boxA, boxB);

        //         if (isOverlap) {
        //           overLapCount += 1;
        //           const boxIndex = newBoxList.findIndex((box) => {
        //             return box.id === boxA.id;
        //           });
        //           newBoxList[boxIndex].localPosition.x += overLapCount;
        //         }
        //       }
        //     });

        //     if (overLapCount <= 0) {
        //       // const boxIndex = newBoxList.findIndex((box) => {
        //       //   return box.id === boxA.id;
        //       // });
        //       // const tmpBox = _.cloneDeep(newBoxList[boxIndex]);
        //       // tmpBox.localPosition.x = 0;
        //       // console.log(tmpBox);
        //       // const isOverlap = overlapBox(boxA, tmpBox);
        //       // if (!isOverlap) {
        //       //   newBoxList[boxIndex].localPosition.x = 0;
        //       // }
        //     }
        //   });

        //   newColumnList[index].colDiv = overLapCount + 1;
        // }

        return col;
      });

      newBoxList.forEach((box, index) => {
        const boxColIndex = getColIndex(box.position.x);
        const col = newColumnList[boxColIndex];

        if (box.id === droppedBox.id) {
          if (boxColIndex !== droppedBox.position.x) {
            newBoxList[index].position = {
              x: boxColIndex,
              y: droppedBox.position.y,
            };
          }
        } else {
          if (col.colDiv <= 1 && box.localPosition.x > 0) {
            newBoxList[index].localPosition = {
              x: 0,
              y: box.localPosition.y,
            };
          }

          // let x = 0;

          // newColumnList.forEach((col2, i) => {
          //   for (let j = 0; j < col2.colDiv; j++) {
          //     if (i === boxColIndex) {
          //       newBoxList[index].position = {
          //         x,
          //         y: box.position.y,
          //       };
          //     }

          //     x += 1;
          //   }

          //   x += 1;
          // });

          //   // if (boxColIndex !== box.position.x) {
          //   //   newBoxList[index].position = {
          //   //     x: boxColIndex,
          //   //     y: droppedBox.position.y,
          //   //   };
          //   // }
          // }
        }
      });

      onUpdateBoxList(newBoxList);
      onUpdateColumnList(newColumnList);
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
          isMouseDown={isMouseDown}
          onUpdateBox={onUpdateBox}
          onDropBox={handleDropBox}
          onUpdateBoxList={onUpdateBoxList}
        />
      </div>
    </div>
  );
};
