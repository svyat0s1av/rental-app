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
