import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  TextField,
  PrimaryButton,
  Stack,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import { IEmployee } from "../../Interfaces/IEmployee";
import {
  getEmployeeById,
  updateEmployee,
} from "../../Services/employeeService";
import styles from "./EditPage.module.scss";
const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchEmployee = async (): Promise<void> => {
      try {
        const emp = await getEmployeeById(parseInt(id, 10));
        setEmployee(emp);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setErrorMessage("Error fetching employee");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployee().catch(error => console.error("Faild in fetchEmployee:", error));;
  }, [id]);

  const Change = (field: keyof IEmployee, value: string) => {
    if (employee) {
      setEmployee({ ...employee, [field]: value });
    }
  };

  // Update emp in list
  const Update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (employee) {
      try {
        await updateEmployee(employee.id, employee);
        setSubmitted(true);
        history.push(`/preview/${employee.id}`);
      } catch (error) {
        console.error("Error updating employee:", error);
        setErrorMessage("Error updating employee");
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.spinner}>
        <p>Loading employee...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className={styles.edit}>
        <p>Employee not found</p>
        <PrimaryButton onClick={() => history.push("/listing")}>
          Back to List
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className={styles.edit}>
      {errorMessage && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
          {errorMessage}
        </MessageBar>
      )}
      {submitted && (
        <MessageBar messageBarType={MessageBarType.success} isMultiline={false}>
          Employee updated successfully!
        </MessageBar>
      )}
      <form onSubmit={Update}>
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Name"
            required
            value={employee.name}
            onChange={(e, newValue) => Change("name", newValue || "")}
          />
          <TextField
            label="Job Title"
            required
            value={employee.jobTitle}
            onChange={(e, newValue) => Change("jobTitle", newValue || "")}
          />
          <TextField
            label="Department"
            required
            value={employee.department}
            onChange={(e, newValue) => Change("department", newValue || "")}
          />
          <TextField
            label="Email"
            type="email"
            required
            value={employee.email}
            onChange={(e, newValue) => Change("email", newValue || "")}
          />
          <TextField
            label="Profile Picture URL"
            required
            value={employee.profilePictureUrl}
            onChange={(e, newValue) =>
              Change("profilePictureUrl", newValue || "")
            }
          />
          <PrimaryButton text="Update Employee" type="submit" />
        </Stack>
      </form>
    </div>
  );
};

export default EditPage;
