// src/app/model/user.model.ts

// ✨ ISPRAVKA: Dodat je exportovan enum
export enum UserType {
  STUDENT = 'STUDENT',
  PROFESSOR = 'PROFESSOR',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface User {
  id?: number;
  username: string;
  email: string;
  jmbg?: string;
  name: string;
  surname: string;
  biography?: string;
  type: UserType;
  // Dodajte ostale atribute ako su potrebni
}