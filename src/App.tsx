import { useState } from "react";
import "./App.css";
import { UploadForm } from "./components/Upload/UploadForm";
import { WardrobeGrid } from "./components/Wardrobe/WardrobeGrid";
import { OutfitCreator } from "./components/Outfit/OutfitCreator";

function App() {
  const [activeTab, setActiveTab] = useState<"wardrobe" | "upload" | "outfit">(
    "wardrobe"
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            数字衣柜 / Digital Wardrobe
          </h1>
          <nav className="flex justify-center gap-4">
            {[
              { id: "wardrobe", label: "衣柜预览" },
              { id: "upload", label: "上传物品" },
              { id: "outfit", label: "搭配创建" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`btn ${
                  activeTab === tab.id ? "btn-primary" : "btn-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="bg-white rounded-2xl shadow-xl p-6">
          {activeTab === "wardrobe" && <WardrobeGrid />}
          {activeTab === "upload" && <UploadForm />}
          {activeTab === "outfit" && <OutfitCreator />}
        </main>
      </div>
    </div>
  );
}

export default App;
