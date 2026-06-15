export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "pastry" | "bread" | "cake" | "macaron";
  imageUrl: string;
  tags?: string[];
  calories?: number;
  allergen?: string[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedFlavor?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  tag: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}
