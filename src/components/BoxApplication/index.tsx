import clsx from 'clsx';
import React from 'react';

import styles from './index.module.scss';

type Props = {
  children: React.ReactNode;
};

export const BoxApplication: React.FC<Props> = ({ children }) => {
  return <div className={clsx(styles.application)}>{children}</div>;
};
