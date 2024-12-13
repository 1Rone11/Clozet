import { useState } from "react";
import { Category, ClothingItem } from "../../types/types";
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface PendingItem {
  file: File;
  preview: string;
  name: string;
}

export function UploadForm() {
  const [category, setCategory] = useState<Category>("tops");
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [items, setItems] = useLocalStorage<ClothingItem[]>(
    "wardrobeItems",
    []
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newPendingItems = await Promise.all(
      files.map(async (file) => {
        const preview = await readFileAsDataURL(file);
        return {
          file,
          preview,
          name: file.name.split(".")[0], // 默认使用文件名作为物品名称
        };
      })
    );

    setPendingItems([...pendingItems, ...newPendingItems]);
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleNameChange = (index: number, newName: string) => {
    const newPendingItems = [...pendingItems];
    newPendingItems[index].name = newName;
    setPendingItems(newPendingItems);
  };

  const handleRemovePending = (index: number) => {
    setPendingItems(pendingItems.filter((_, i) => i !== index));
  };

  const handleConfirmUpload = () => {
    if (pendingItems.length === 0) {
      alert("请先选择要上传的图片！");
      return;
    }

    const newItems: ClothingItem[] = pendingItems.map((item) => ({
      id: crypto.randomUUID(),
      category,
      imageUrl: item.preview,
      name: item.name,
      createdAt: Date.now(),
    }));

    setItems([...items, ...newItems]);
    setPendingItems([]); // 清空待上传列表
    alert("上传成功！");
  };

  return (
    <form className="max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            类别
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="tops">上衣</option>
            <option value="bottoms">裤子</option>
            <option value="shoes">鞋子</option>
            <option value="accessories">配饰</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            选择图片
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500"
                >
                  <span>上传图片</span>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*"
                  />
                </label>
                <p className="pl-1">或拖拽图片到此处</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF 最大 10MB</p>
            </div>
          </div>
        </div>

        {pendingItems.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              待上传物品 ({pendingItems.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pendingItems.map((item, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={item.preview}
                      alt="预览"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="mt-2 w-full px-2 py-1 text-sm border rounded"
                    placeholder="物品名称"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePending(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={handleConfirmUpload}
                className="btn btn-primary"
              >
                确认上传 ({pendingItems.length} 件物品)
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
