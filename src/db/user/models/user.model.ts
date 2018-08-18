export interface UserModel {
  id: string;
  username: string;
  hash: string;
  roles: string[];
  instances: number;
}
