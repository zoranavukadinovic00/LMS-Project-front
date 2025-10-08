import { UserType } from './user.model';

export interface RegisterRequest {
  id?: number;
  username: string;
  password?: string;
  email: string;
  // FIX 4: Uklonjena '?' jer je backend validacija pokazala da je JMBG obavezan.
  jmbg: string; 
  name: string;
  surname: string;
  biography?: string;
  type: UserType;
}
