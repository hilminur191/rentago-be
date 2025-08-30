export interface ICreateUserParam {
  name: string;
  email: string;
  password: string;
  role: "USER" | "TENANT";
  profilePicture?: string;
}

export interface IUpdateUserParam {
  name?: string;
  email?: string;
  password?: string;
  role: "USER" | "TENANT";
  profilePicture?: string;
}
