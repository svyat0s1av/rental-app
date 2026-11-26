export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  role: 'renter' | 'owner' | 'admin';
}
