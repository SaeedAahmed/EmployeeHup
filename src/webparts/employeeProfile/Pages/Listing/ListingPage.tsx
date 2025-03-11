import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { TextField, Spinner, SpinnerSize } from '@fluentui/react';
import EmployeeCard from '../../components/EmployeeCard/EmployeeCard';
import styles from './ListingPage.module.scss';
import { deleteEmployee, getEmployees } from '../../Services/employeeService';
import { IEmployee } from '../../Interfaces/IEmployee';

const ListingPage: React.FC = () => {
  const [employeeList, setEmployeeList] = useState<IEmployee[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [delaySearch, setDelaySearch] = useState(searchText);

  const history = useHistory();

  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDelaySearch(searchText);
      setIsSearching(false);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => { 
    const fetchData = async (): Promise<void> => { 
      try {
        const employees = await getEmployees(); 
        setEmployeeList(employees); 
      } catch (error) {
        console.error("Faild fetching employees", error);
      } finally {
        setIsLoading(false); 
      }
    }; 
  
     fetchData().catch(error => console.error("faild in fetchEmployee:", error));; 
  }, []);

  const filteredEmployees = employeeList.filter(emp =>
    emp.name.toLowerCase().includes(delaySearch.toLowerCase())
  );

  const Delete = async (id: number):Promise<void> => {
    try {
      await deleteEmployee(id);
      setEmployeeList(p => p.filter(emp => emp.id !== id));
    } catch (error) {
      console.error("Faild deleting employee", error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.spinner}>
        <Spinner size={SpinnerSize.large} label="Loading..." />
      </div>
    );
  }

  return (
    <div className={styles.listingPage}>
      <div className={styles.create}>
        <button
          className={styles.createBtn}
          onClick={() => history.push('/form')}
        >
          Create Employee →
        </button>
      </div>
      <div className={styles.search}>
        <TextField
          className={styles.searchField}
          placeholder="Search by name..."
          value={searchText}
          onChange={(e, newValue) => setSearchText(newValue || '')}
        />
      </div>
      {isSearching ? (
        <div className={styles.spinner}>
          <Spinner size={SpinnerSize.large} label="Searching..." />
        </div>
      ) : (
        <div className={styles.cardsContainer}>
          {filteredEmployees.map(emp => (
            <EmployeeCard key={emp.id} employee={emp} onDelete={Delete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingPage;
