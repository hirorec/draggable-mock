import clsx from 'clsx';
import React from 'react';

import styles from './index.module.scss';
import { useBoxConfirmModal } from '../../hooks/useBoxConfirmModal';

type Props = {
  onClose?: (isApprove: boolean) => void;
};

export const ConfirmModal: React.FC<Props> = ({ onClose = () => {} }) => {
  const { isOpen, hideModal } = useBoxConfirmModal();

  const handleClose = (value: boolean) => {
    hideModal();
    onClose(value);
  };

  if (isOpen) {
    return (
      <div className={clsx(styles.modal)}>
        <div className={clsx(styles.modalContainer)}>
          <div>変更しますか？</div>
          <div className={clsx(styles.modalContainerFooter)}>
            <button className={clsx(styles.button, styles.cancel)} onClick={() => handleClose(false)}>
              CANCEL
            </button>
            <button className={clsx(styles.button, styles.ok)} onClick={() => handleClose(true)}>
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
