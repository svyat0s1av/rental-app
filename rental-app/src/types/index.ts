export interface PropertyImage {
  id: number;
  url: string;
}

export interface Property {
  id: number;
  title: string;
  address: string;
  price: number;
  rooms: number;
  area: number;
  description: string;
  owner_id: number;
  images?: PropertyImage[];
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  role: 'renter' | 'owner' | 'admin';
}

export interface Contract {
  id: number;
  property_id: number;
  renter_id: number;
  start_date: string;
  end_date: string;
  status: string;
  document_url?: string | null;
}

export interface Payment {
  id: number;
  contract_id: number;
  amount: number;
  description: string;
  status: string;
  receipt_url?: string | null;
  created_at: string;
}
