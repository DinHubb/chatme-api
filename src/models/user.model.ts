export interface UserAuth {
  password: string;
  salt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  authentication: UserAuth[];
}
