export interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    category_id: number;
    images: string[] | string;
  }
  
  export interface Category {
    id: number;
    name: string;
  }
  export interface User {
    role?: string;
  }