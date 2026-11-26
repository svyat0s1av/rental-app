export interface Payment {
  id: number;
  contract_id: number;
  amount: number;
  description: string;
  status: string;
  receipt_url?: string | null;
  created_at: string;
}
