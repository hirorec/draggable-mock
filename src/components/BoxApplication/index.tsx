import clsx from 'clsx';
import React from 'react';

import { BoxProps } from '@/types';

import styles from './index.module.scss';
import { BoxContainer } from '../BoxContainer';
import { Column } from '../Column';

type Props = {
  boxList: BoxProps[];
  onUpdateBox: (box: BoxProps, index: number) => void;
};

export const BoxApplication: React.FC<Props> = ({ boxList, onUpdateBox }) => {
  return (
    <div className={clsx(styles.application)}>
      <div className={clsx(styles.columnContainer)}>
        <Column />
        <Column />
        <Column />
        <Column />
        <Column />
      </div>
      <BoxContainer boxList={boxList} onUpdateBox={onUpdateBox} />
    </div>
  );
};
