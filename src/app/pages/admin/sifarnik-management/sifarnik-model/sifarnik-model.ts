/**
 * Modeli podataka (Interfejsi) za šifarnike.
 */
export interface Country {
  id?: number;
  name: string;
}

export interface Place {
  id?: number;
  name: string;
  postalCode: string;
  countryId?: number; // Ključ za Country
}

export interface Address {
  id?: number;
  street: string;
  number: string;
  placeId?: number; // Ključ za Place
}