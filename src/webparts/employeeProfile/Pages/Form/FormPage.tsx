import React, { useState } from "react";
import {
  TextField,
  Stack,
  MessageBar,
  MessageBarType,
  Label,
} from "@fluentui/react";
import { useHistory } from "react-router-dom";
import { IEmployee } from "../../Interfaces/IEmployee";
import styles from "../Form/FormPage.module.scss";
import { createEmployee } from "../../Services/employeeService";
import { uploadImage } from "../../Services/employeeService";

const FormPage: React.FC = () => {
  const [employee, setEmployee] = useState<IEmployee>({
    id: 0,
    name: "",
    jobTitle: "",
    department: "",
    email: "",
    profilePictureUrl: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    jobTitle: "",
    department: "",
    email: "",
    profilePictureUrl: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();

  const validate = (): boolean => {
    let isValid = true;
    const error = {
      name: "",
      jobTitle: "",
      department: "",
      email: "",
      profilePictureUrl: "",
    };

    if (!employee.name.trim()) {
      error.name = "Name is required";
      isValid = false;
    }
    if (!employee.jobTitle.trim()) {
      error.jobTitle = "Job Title is required";
      isValid = false;
    }
    if (!employee.department.trim()) {
      error.department = "Department is required";
      isValid = false;
    }
    if (!employee.email.trim()) {
      error.email = "Email is required";
      isValid = false;
    } else {
      const emailRegex = /^.+@[a-zA-Z]+(\.[a-zA-Z]+)+$/;
      if (!emailRegex.test(employee.email)) {
        error.email = "Email is invalid";
        isValid = false;
      }
    }
    if (!employee.profilePictureUrl) {
      error.profilePictureUrl = "Profile picture is required";
      isValid = false;
    }

    setErrors(error);
    return isValid;
  };

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      let imageUrl = "";

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      await createEmployee({
        ...employee,
        profilePictureUrl: imageUrl,
      });

      setEmployee({
        id: 0,
        name: "",
        jobTitle: "",
        department: "",
        email: "",
        profilePictureUrl: "",
      });
      setSelectedFile(null);
      setSubmitted(true);
      setErrorMessage("");
    } catch{
      setErrorMessage("Faild craete employee");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const previewUrl = URL.createObjectURL(selectedFile); 
      setEmployee({
        ...employee,
        profilePictureUrl: previewUrl,
      });
      setSelectedFile(selectedFile);
      setErrors((p) => ({ ...p, profilePictureUrl: "" }));
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <button
          className={styles.create}
          onClick={() => history.push("/listing")}
        >
          ← Back to List
        </button>
      </div>
      {submitted && (
        <MessageBar messageBarType={MessageBarType.success} isMultiline={false}>
          Form submitted successfully!
        </MessageBar>
      )}
      {errorMessage && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
          {errorMessage}
        </MessageBar>
      )}

      <form onSubmit={onSubmit}>
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Name"
            required
            value={employee.name}
            onChange={(e, newValue) =>
              setEmployee({ ...employee, name: newValue || "" })
            }
            onBlur={validate}
            errorMessage={errors.name}
          />
          <TextField
            label="Job Title"
            required
            value={employee.jobTitle}
            onChange={(e, newValue) =>
              setEmployee({ ...employee, jobTitle: newValue || "" })
            }
            onBlur={validate}
            errorMessage={errors.jobTitle}
          />
          <TextField
            label="Department"
            required
            value={employee.department}
            onChange={(e, newValue) =>
              setEmployee({ ...employee, department: newValue || "" })
            }
            onBlur={validate}
            errorMessage={errors.department}
          />
          <TextField
            label="Email"
            type="email"
            required
            value={employee.email}
            onChange={(e, newValue) =>
              setEmployee({ ...employee, email: newValue || "" })
            }
            onBlur={validate}
            errorMessage={errors.email}
          />
          <div>
            <Label>Profile Picture</Label>
            <input type="file" accept="image/*" onChange={onFileChange} />
            {errors.profilePictureUrl && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.profilePictureUrl}
              </span>
            )}
            {employee.profilePictureUrl && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={employee.profilePictureUrl}
                  alt="Preview"
                  style={{ width: "100px", height: "auto" }}
                />
              </div>
            )}
          </div>
          <button className={styles.submit} type="submit">
            Submit
          </button>
        </Stack>
      </form>
    </div>
  );
};

export default FormPage;
