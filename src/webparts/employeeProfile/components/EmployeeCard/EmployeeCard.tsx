import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './EmployeeCard.module.scss';

import { IEmployee } from '../../Interfaces/IEmployee';
import Popup from '../DeleteModel/Popup';

interface IEmployeeCardProps {
  employee: IEmployee;
  onDelete: (id: number) => void;
}

const EmployeeCard: React.FC<IEmployeeCardProps> = ({ employee, onDelete }) => {
  const history = useHistory();
  const [isPopupHidden, setIsPopupHidden] = useState(true);

  const openPopup = ():void => setIsPopupHidden(false);
  const closePopup = (): void => setIsPopupHidden(true);

  const confirmDelete = ():void=> {
    onDelete(employee.id);
    closePopup();
  };

  const viewMore = (): void => {
    history.push(`/preview/${employee.id}`);
  };

  return (
    <div className={styles.cardContainer}>
      <img
        src={employee.profilePictureUrl}
        alt={employee.name}
        className={styles.profilePic}
      />
      <h3 className={styles.cardTitle}>{employee.name}</h3>
      <p className={styles.jobTitle}>{employee.jobTitle}</p>

      <div className={styles.buttonContainer}>
        <button className={styles.viewMoreBtn} onClick={viewMore}>
          View More
        </button>
        <button className={styles.deleteBtn} onClick={openPopup}>
          Delete
        </button>
      </div>

      <Popup
        hidden={isPopupHidden}
        message={`Are you sure you want to delete ${employee.name}?`}
        onConfirm={confirmDelete}
        onClose={closePopup}
      />
    </div>
  );
};

export default EmployeeCard;
