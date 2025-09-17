// src/app/model/university.model.ts

export interface AddressDetails {
  street: string;
  number: string;
  city: string;
  country: string;
}

export interface RectorDetails {
  id: number;
  fullName: string;
  email: string;
}

export interface University {
  id: number;
  name: string;
  address: string;
  contact: string;
  description: string;
  dateOfEstablishment: Date | null; // ✨ This is the key change
  rectorName: string; 
  rectorEmail?: string; 
  
  addressDetails?: AddressDetails;
  rectorDetails?: RectorDetails;
}