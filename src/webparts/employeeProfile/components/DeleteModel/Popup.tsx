import React from 'react';
import styles from './Popup.module.scss'
export interface IPopupProps {
  hidden: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const Popup: React.FC<IPopupProps> = ({ hidden, message, onConfirm, onClose }) => {
  if (hidden) return null;

  return (
    <div className={styles.popup}>
      <div className={styles.popupContainer}>
        <p className={styles.message}>{message} </p>
        <div className={styles.popupActions}>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Confirm
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
