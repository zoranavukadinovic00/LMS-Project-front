// src/app/model/register-request.model.ts

import { UserType } from './user.model';

// ✨ ISPRAVKA: Dodat je 'export' ispred 'interface'
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