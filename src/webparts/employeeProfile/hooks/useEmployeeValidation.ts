import { useState } from "react";
import { IEmployee } from "../Interfaces/IEmployee";

interface IErrors {
  name: string;
  jobTitle: string;
  department: string;
  email: string;
  profilePictureUrl: string;
}

export const useEmployeeValidation = (
  employee: IEmployee
): { errors: IErrors; validate: () => boolean } => {
  const [errors, setErrors] = useState<IErrors>({
    name: "",
    jobTitle: "",
    department: "",
    email: "",
    profilePictureUrl: "",
  });

  const validate = (): boolean => {
    let isValid = true;
    const errorsObj: IErrors = {
      name: "",
      jobTitle: "",
      department: "",
      email: "",
      profilePictureUrl: "",
    };

    if (!employee.name.trim()) {
      errorsObj.name = "Name is required";
      isValid = false;
    }
    if (!employee.jobTitle.trim()) {
      errorsObj.jobTitle = "Job Title is required";
      isValid = false;
    }
    if (!employee.department.trim()) {
      errorsObj.department = "Department is required";
      isValid = false;
    }
    if (!employee.email.trim()) {
      errorsObj.email = "Email is required";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(employee.email)) {
        errorsObj.email = "Email is invalid";
        isValid = false;
      }
    }
    if (!employee.profilePictureUrl.trim()) {
      errorsObj.profilePictureUrl = "Profile picture is required";
      isValid = false;
    }

    setErrors(errorsObj);
    return isValid;
  };

  return { errors, validate };
};
