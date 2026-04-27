export interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  categories: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  _id: string;
  title: string;
  image: string;
}

export interface ShippingAddress {
  city: string;
  street: string;
  phone: string;
}
