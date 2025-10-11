import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllLetterHeights, createLetterHeight, updateLetterHeight, deleteLetterHeight } from '../services/api';

const LetterHeights = () => {
  const [heights, setHeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    height: '',
    price: ''
  });

  useEffect(() => {
    fetchHeights();
  }, []);

  const fetchHeights = async () => {
    try {
      setLoading(true);
      const response = await getAllLetterHeights();
      setHeights(response.data.data || []);
    } catch (error) {
      console.error('Error fetching letter heights:', error);
      toast.error('Harf yükseklikleri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.height || !formData.price) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      if (editingItem) {
        await updateLetterHeight(editingItem.id, formData);
        toast.success('Yükseklik güncellendi');
      } else {
        await createLetterHeight(formData);
        toast.success('Yükseklik eklendi');
      }

      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ height: '', price: '' });
      fetchHeights();
    } catch (error) {
      console.error('Error saving height:', error);
      toast.error('Kaydetme sırasında hata oluştu');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      height: item.height,
      price: item.price
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu yüksekliği silmek istediğinize emin misiniz?')) {
      try {
        await deleteLetterHeight(id);
        toast.success('Yükseklik silindi');
        fetchHeights();
      } catch (error) {
        console.error('Error deleting height:', error);
        toast.error('Silme sırasında hata oluştu');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ height: '', price: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Harf Yükseklikleri</h1>
            <p className="text-gray-600">Tabela harf yüksekliklerini yönetin</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>Yeni Yükseklik Ekle</span>
          </button>
        </div>
        {/* Stats Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Toplam Yükseklik</p>
                <p className="text-3xl font-bold mt-2">{heights.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Ortalama Fiyat</p>
                <p className="text-3xl font-bold mt-2">
                  {heights.length > 0
                    ? (heights.reduce((sum, item) => sum + parseFloat(item.price), 0) / heights.length).toFixed(2)
                    : '0.00'} ₺
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Fiyat Aralığı</p>
                <p className="text-xl font-bold mt-2">
                  {heights.length > 0
                    ? `${Math.min(...heights.map(item => parseFloat(item.price))).toFixed(2)} - ${Math.max(...heights.map(item => parseFloat(item.price))).toFixed(2)} ₺`
                    : '0.00 - 0.00 ₺'}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid mt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {heights.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Height Display */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                    {item.height}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Yükseklik: {item.height}</h3>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="text-2xl font-bold text-purple-600">{item.price} ₺</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {heights.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📏</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz harf yüksekliği yok</h3>
            <p className="text-gray-600 mb-6">Başlamak için yeni bir yükseklik ekleyin</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              İlk Yüksekliği Ekle
            </button>
          </div>
        )}

        
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingItem ? 'Yükseklik Düzenle' : 'Yeni Yükseklik Ekle'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Height */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Yükseklik <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="Örn: 10cm, 15cm, 20cm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fiyat (₺) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                >
                  {editingItem ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterHeights;
