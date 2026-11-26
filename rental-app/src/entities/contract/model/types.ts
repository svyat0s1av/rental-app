export interface Contract {
  id: number;
  property_id: number;
  renter_id: number;
  start_date: string;
  end_date: string;
  status: string;
  document_url?: string | null;
}
