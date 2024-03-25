import clsx from 'clsx';
import React from 'react';

import styles from './index.module.scss';

export const ConfirmModal: React.FC = () => {
  return (
    <div className={clsx(styles.modal)}>
      <div className={clsx(styles.modalContainer)}>
        <div>変更しますか？</div>
        <div className={clsx(styles.modalContainerFooter)}>
          <button className={clsx(styles.button, styles.cancel)}>CANCEL</button>
          <button className={clsx(styles.button, styles.ok)}>OK</button>
        </div>
      </div>
    </div>
  );
};
