import * as React from 'react';
import { HashRouter as Router, Switch, Route} from 'react-router-dom';
import styles from './EmployeeProfile.module.scss';

import FormPage from '../Pages/Form/FormPage';
import ListingPage from '../Pages/Listing/ListingPage';
import PreviewPage from '../Pages/Preview/PreviewPage';
import { IEmployeeProfileProps } from './IEmployeeProfileProps';
import EditPage from '../Pages/Edit/EditPage';

const EmployeeProfile: React.FC<IEmployeeProfileProps> = (props) => {
  return (
    <Router>
      <section className={styles.employeeProfile}>
       
        <Switch>
        <Route path="/edit/:id">
            <EditPage />
          </Route>
          <Route path="/form">
            <FormPage />
          </Route>
          <Route path="/listing">
            <ListingPage />
          </Route>
          <Route path="/preview/:id">
            <PreviewPage />
          </Route>
          <Route path="/" exact>
            <ListingPage />
          </Route>
          
        </Switch>
      </section>
    </Router>
  );
};

export default EmployeeProfile;
