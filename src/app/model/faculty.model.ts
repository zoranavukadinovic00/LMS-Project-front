export interface Faculty {
  id: number;
  name: string;
  address: string;
  contact: string;
  description: string;
  universityId?: number;
  deanName: string;
  deanEmail?: string;
  
  addressDetails?: AddressDetails;
  deanDetails?: DeanDetails;
}

export interface AddressDetails {
  street: string;
  number: string;
  city: string;
  country: string;
}

export interface DeanDetails {
  id: number;
  fullName: string;
  email: string;
}