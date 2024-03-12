import clsx from 'clsx';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';

import { BoxAppProvider, useBoxAppOrigin } from '@/features/BoxApplication/hooks/useBoxApp';
import { BoxProps, ColumnProps } from '@/features/BoxApplication/types';

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
  const { initialized, isAppModifying, setInitialized, selectedBoxId, modifyData } = blockAppOrigin;

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

  if (initialized) {
    return (
      <BoxAppProvider value={blockAppOrigin}>
        <div className={clsx(styles.application)}>
          <div className={clsx(styles.applicationInner)}>
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
          </div>
        </div>
      </BoxAppProvider>
    );
  } else {
    return <></>;
  }
};
