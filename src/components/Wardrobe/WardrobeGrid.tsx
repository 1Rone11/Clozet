import { useState } from "react";
import { Category, ClothingItem } from "../../types/types";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export function WardrobeGrid() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  );
  const [items, setItems] = useLocalStorage<ClothingItem[]>(
    "wardrobeItems",
    []
  );

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleDelete = (itemId: string) => {
    if (window.confirm("确定要删除这件物品吗？")) {
      setItems(items.filter((item) => item.id !== itemId));
    }
  };

  const categories = [
    { id: "all", label: "全部" },
    { id: "tops", label: "上衣" },
    { id: "bottoms", label: "裤子" },
    { id: "shoes", label: "鞋子" },
    { id: "accessories", label: "配饰" },
  ];

  return (
    <div>
      <div className="flex justify-center gap-3 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as Category | "all")}
            className={`btn ${
              selectedCategory === category.id ? "btn-primary" : "btn-secondary"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
          >
            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
            <div className="aspect-square">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
