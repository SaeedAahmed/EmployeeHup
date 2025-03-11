import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styles from './PreviewPage.module.scss';
import { IEmployee } from '../../Interfaces/IEmployee';
import { getEmployeeById } from '../../Services/employeeService';

const PreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
    

  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async ():Promise<void> => {
      try {
        const emp = await getEmployeeById(parseInt(id, 10));
        setEmployee(emp);
      } catch (error) {
        console.error("faild fetching employee:", error);
      } finally {
        setIsLoading(false);
      }
    };

 fetchEmployee().catch(error => console.error("faild in fetchEmployee:", error));
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.preview}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className={styles.preview}>
        <h2>Employee not found</h2>
        <button className={styles.actionBtn} onClick={() => history.push('/listing')}>
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className={styles.preview}>
      <div className={styles.header}>
        <p>Employee Profile:<strong>{employee.name}</strong></p>
      </div>
      <div className={styles.content}>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <p><strong>Department: </strong>{employee.department}</p>
            <p><strong>Job Title: </strong>{employee.jobTitle}</p>
            <p><strong>Email: </strong>{employee.email}</p>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <img
            src={employee.profilePictureUrl}
            alt={employee.name}
            className={styles.profileImage}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={() => history.push('/listing')}>
          ← Back to List
        </button>
        <button 
          className={styles.editBtn} 
          onClick={() => history.push(`/edit/${employee.id}`)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;
