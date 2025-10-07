export interface ICreateUserParam {
  name: string;
  email: string;
  password: string;
  role: "USER" | "TENANT";
}

export interface IUpdateUserParam {
  name?: string;
  email?: string;
  password?: string;
  role: "USER" | "TENANT";
  profilePicture?: Express.Multer.File;
}