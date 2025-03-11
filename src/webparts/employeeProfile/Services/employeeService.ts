import { SPFI, spfi } from "@pnp/sp"; 
import { SPFx } from "@pnp/sp/behaviors/spfx"; 
import "@pnp/sp/webs"; 
import "@pnp/sp/lists"; 
import "@pnp/sp/items"; 
import "@pnp/sp/folders"; 
import "@pnp/sp/files"; 


import { WebPartContext } from "@microsoft/sp-webpart-base"; 
import { IEmployee } from "../Interfaces/IEmployee"; 

let _sp: SPFI | undefined = undefined;

export const SP = (context: WebPartContext): void => { 
  if (!_sp) { 
    _sp = spfi().using(SPFx(context));
  } 
}; 

/*   Create Employee   */
import { IItem } from "@pnp/sp/items";

export const createEmployee = async (employee: IEmployee): Promise<IItem> => {
  if (!_sp) throw new Error("not initialized!لم  !");

  try {
    const item = await _sp.web.lists.getByTitle("EmployeesProfile").items.add({
      Title: employee.name,
      JobTitle: employee.jobTitle,
      Department: employee.department,
      Email: employee.email,
      ProfilePictureUrl: employee.profilePictureUrl,
    });

    return item; 
  } catch (error) {
    console.error("Failed creating employee", error);
    throw error;
  }
};


/*   Get Employees   */
export const getEmployees = async (): Promise<IEmployee[]> => { 
  if (!_sp) throw new Error("not initialized!"); 

  try { 
    const items = await _sp.web.lists.getByTitle("EmployeesProfile").items.select( 
      "Id", 
      "Title", 
      "JobTitle", 
      "Department", 
      "Email", 
      "ProfilePictureUrl" 
    )(); 

    return items.map((item) => ({ 
      id: item.Id, 
      name: item.Title, 
      jobTitle: item.JobTitle, 
      department: item.Department, 
      email: item.Email, 
      profilePictureUrl: item.ProfilePictureUrl, 
    })); 
  } catch (error) { 
    console.error("Faild fetching employees", error); 
    return []; 
  } 
}; 

/*   Get Employee By ID   */
export const getEmployeeById = async (id: number): Promise<IEmployee> => { 
  if (!_sp) throw new Error("not initialized!"); 

  try { 
    const item = await _sp.web.lists.getByTitle("EmployeesProfile").items.getById(id) 
      .select("Id", "Title", "JobTitle", "Department", "Email", "ProfilePictureUrl")(); 

    return { 
      id: item.Id, 
      name: item.Title, 
      jobTitle: item.JobTitle, 
      department: item.Department, 
      email: item.Email, 
      profilePictureUrl: item.ProfilePictureUrl 
    }; 
  } catch (error) { 
    console.error("Faild fetching employee:", error); 
    throw error; 
  } 
}; 

/*   Delete Employee   */
export const deleteEmployee = async (id: number): Promise<void> => { 
  if (!_sp) throw new Error("not initialized!"); 

  try { 
    await _sp.web.lists.getByTitle("EmployeesProfile").items.getById(id).delete(); 
  } catch (error) { 
    console.error("faild deleting employee", error); 
     
  } 
}; 

/*   Update Employee   */
export const updateEmployee = async (id: number, employee: IEmployee): Promise<void> => { 
  if (!_sp) throw new Error("not initialized!"); 

  try { 
    await _sp.web.lists.getByTitle("EmployeesProfile").items.getById(id).update({ 
      Title: employee.name, 
      JobTitle: employee.jobTitle, 
      Department: employee.department, 
      Email: employee.email, 
      ProfilePictureUrl: employee.profilePictureUrl 
    }); 
  } catch (error) { 
    console.error("Faild updating employee", error); 
    throw error; 
  } 
}; 

/*   Upload Image   */

export const uploadImage = async (file: File): Promise<string> => {   
  if (!_sp) throw new Error("not initialized!");  

  try {   
    const fileName = `${Date.now()}-${file.name}`;    
    const folder = _sp.web.getFolderByServerRelativePath("/sites/WorkForce/EmployeePhotos");    

    const uploadedFile = await folder.files.addUsingPath(fileName, file, { Overwrite: true });    

    const serverRelativeUrl = uploadedFile.ServerRelativeUrl; 
    const absoluteUrl = `https://quadintelligence.sharepoint.com${serverRelativeUrl}`; 

    return absoluteUrl; 
  } catch (error) {   
    console.error("Faild uploading file:", error);    
    throw error;    
  }   
};






