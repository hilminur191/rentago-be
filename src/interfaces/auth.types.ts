export interface ILoginParam {
  role: "USER" | "TENANT";
  email: string;
  password: string;
}

export interface IRegisterParam {
  role: "USER" | "TENANT";
  name: string;
  email: string;
  password: string;
}

export interface IJwtPayload {
  role: "USER" | "TENANT";
  id: string;
  name: string;
  email: string;
}