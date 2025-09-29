
import { useState } from 'react';

const CreateTable = () => {
  const [formData, setFormData] = useState({
    lightOnDesc: '',
    lightOnPrice: '',
    lightOffDesc: '',
    lightOffPrice: '',
    letterMaterials: [{ name: '', price: '' }],
    letterHeights: [{ name: '', price: '' }],
    backgrounds: [{ name: '', price: '' }]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (type, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = (type) => {
    if (formData[type].length < 6) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], { name: '', price: '' }]
      }));
    }
  };

  const removeItem = (type, index) => {
    if (formData[type].length > 1) {
      setFormData(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  const renderSection = (title, type, placeholder) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {formData[type].length < 6 && (
          <button
            type="button"
            onClick={() => addItem(type)}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            + Ekle
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData[type].map((item, index) => (
          <div key={index} className="flex gap-3 p-3 border border-gray-200 rounded-md">
            <input
              type="text"
              placeholder={`${placeholder} Adı`}
              value={item.name}
              onChange={(e) => handleArrayInputChange(type, index, 'name', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Fiyat"
              value={item.price}
              onChange={(e) => handleArrayInputChange(type, index, 'price', e.target.value)}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formData[type].length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(type, index)}
                className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tabela Malzemeleri</h1>
          <p className="text-gray-600">Tabela Malzeme Fiyatları</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-10xl mx-auto space-y-6">
          {/* Işık Durumları */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tabela </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Işıklı Tabela</label>
                <input
                  name="lightOnDesc"
                  value={formData.lightOnDesc}
                  onChange={handleInputChange}
                  placeholder="Işıklı Tabela"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">Fiyat</label>
                <input
                  type="number"
                  name="lightOnPrice"
                  value={formData.lightOnPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Işıksız Standart Tabela</label>
                <input
                  name="lightOffDesc"
                  value={formData.lightOffDesc}
                  onChange={handleInputChange}
                  placeholder="Standart Tabela"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">Fiyat</label>
                <input
                  type="number"
                  name="lightOffPrice"
                  value={formData.lightOffPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Malzeme Seçenekleri */}
          <div className="space-y-6">
            {renderSection('Harf Malzemeleri', 'letterMaterials', 'Malzeme')}
            {renderSection('Harf Yükseklikleri', 'letterHeights', 'Yükseklik')}
            {renderSection('Arkaplan Seçenekleri', 'backgrounds', 'Arkaplan')}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Tabela Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTable;