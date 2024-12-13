export type Category = "tops" | "bottoms" | "shoes" | "accessories";

export interface ClothingItem {
  id: string;
  category: Category;
  imageUrl: string;
  name: string;
  tags?: string[];
  createdAt: number;
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  createdAt: number;
}
