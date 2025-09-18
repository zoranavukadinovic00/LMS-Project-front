import { UserType } from './user.model';

export interface RegisterRequest {
  id?: number;
  username: string;
  password?: string;
  email: string;
  jmbg?: string;
  name: string;
  surname: string;
  biography?: string;
  type: UserType;
}