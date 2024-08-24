export interface IUser {
  _id: string;
  profilePicUrl?: string;
  username: string;
  lastName: string;
  email: string;
  password: string;
  newPassword:string;
  displayName: string;
  role?: "student" | "admin";
  major?: string;
  yearOfEntry?: number;
}

export interface IUserForm {
  username?: string;
  lastName?:string;
  email?: string;
  profilePicUrl?: string;
  password?: string;
  newPassword?:string;
  displayName?: string;
  role?: "student" | "admin";
  major?: string;
  yearOfEntry?: number;
}
