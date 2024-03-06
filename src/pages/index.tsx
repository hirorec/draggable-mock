import clsx from 'clsx';
import React from 'react';

import { BoxContainer } from '@/components/BoxContainer';

import styles from './index.module.scss';

const BOX_HEIGHT_STEP = 20;

export default function Page() {
  return (
    <div className={clsx(styles.container)}>
      <BoxContainer width={200} step={BOX_HEIGHT_STEP} />
    </div>
  );
}
