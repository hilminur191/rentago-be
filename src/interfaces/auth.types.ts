export interface ILoginParam {
  email: string;
  password: string;
  role?: "USER" | "TENANT";
}

export interface IRegisterParam {
  email: string;
  role: "USER" | "TENANT";
  name?: string;
}

export interface IJwtPayload {
  role: "USER" | "TENANT";
  id: string;
  name: string;
  email: string;
}
