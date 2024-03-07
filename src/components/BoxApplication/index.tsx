import clsx from 'clsx';
import React from 'react';

import { BoxProps, ColumnProps } from '@/types';

import styles from './index.module.scss';
import { BoxContainer } from '../BoxContainer';
import { ColumnContainer } from '../ColumnContainer';

type Props = {
  boxList: BoxProps[];
  columnList: ColumnProps[];
  onUpdateBox: (box: BoxProps, index: number) => void;
};

export const BoxApplication: React.FC<Props> = ({ boxList, onUpdateBox, columnList }) => {
  return (
    <div className={clsx(styles.application)}>
      <ColumnContainer columnList={columnList} />
      <BoxContainer boxList={boxList} onUpdateBox={onUpdateBox} />
    </div>
  );
};
