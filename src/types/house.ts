// calco de lo que devuelve GET /api/houses

export interface Review {
  id: string;
  author: string;
  date: string;
  comment: string;
  rating: number;
}

export interface House {
  id: string;           // ojo: es string
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  price: number;
  image: string;
  amenities: string[];
  reviews: Review[];
}