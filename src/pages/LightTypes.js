import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllLightTypes, createLightType, updateLightType, deleteLightType } from '../services/api';

const LightTypes = () => {
  const [lightTypes, setLightTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    icon: ''
  });

  // Icon seçenekleri
  const iconOptions = [
    { value: '💡', label: 'Ampul' },
    { value: '🔆', label: 'Parlak' },
    { value: '✨', label: 'Parlak Yıldız' },
    { value: '🌟', label: 'Yıldız' },
    { value: '⭐', label: 'Yıldız 2' },
    { value: '🔅', label: 'Düşük Parlaklık' },
    { value: '☀️', label: 'Güneş' },
    { value: '🌙', label: 'Ay' },
    { value: '🔦', label: 'El Feneri' },
    { value: '💫', label: 'Işıltı' },
    { value: '🎆', label: 'Havai Fişek' },
    { value: '🎇', label: 'Işık Efekti' }
  ];

  useEffect(() => {
    fetchLightTypes();
  }, []);

  const fetchLightTypes = async () => {
    try {
      setLoading(true);
      const response = await getAllLightTypes();
      setLightTypes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching light types:', error);
      toast.error('Aydınlatma tipleri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.icon) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      if (editingItem) {
        await updateLightType(editingItem.id, formData);
        toast.success('Aydınlatma tipi güncellendi');
      } else {
        await createLightType(formData);
        toast.success('Aydınlatma tipi eklendi');
      }

      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ title: '', description: '', price: '', icon: '' });
      fetchLightTypes();
    } catch (error) {
      console.error('Error saving light type:', error);
      toast.error('Kaydetme sırasında hata oluştu');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price,
      icon: item.icon
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu aydınlatma tipini silmek istediğinize emin misiniz?')) {
      try {
        await deleteLightType(id);
        toast.success('Aydınlatma tipi silindi');
        fetchLightTypes();
      } catch (error) {
        console.error('Error deleting light type:', error);
        toast.error('Silme sırasında hata oluştu');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ title: '', description: '', price: '', icon: '' });
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Aydınlatma Tipleri</h1>
            <p className="text-gray-600">Tabela aydınlatma seçeneklerini yönetin</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>Yeni Aydınlatma Tipi</span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lightTypes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 text-3xl shadow-md">
                {item.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

              {/* Price */}
              <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Fiyat</span>
                <span className="text-xl font-bold text-blue-600">{item.price} ₺</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
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
        {lightTypes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz aydınlatma tipi yok</h3>
            <p className="text-gray-600 mb-6">Başlamak için yeni bir aydınlatma tipi ekleyin</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              İlk Aydınlatma Tipini Ekle
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingItem ? 'Aydınlatma Tipini Düzenle' : 'Yeni Aydınlatma Tipi'}
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
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Başlık <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: LED Aydınlatma"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Açıklama <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Aydınlatma tipi hakkında detaylı açıklama"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  İkon Seç <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {iconOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: option.value })}
                      className={`aspect-square rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-3xl hover:scale-110 ${
                        formData.icon === option.value
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      title={option.label}
                    >
                      {option.value}
                    </button>
                  ))}
                </div>
                {formData.icon && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                    <span className="text-4xl">{formData.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Seçili İkon</p>
                      <p className="text-xs text-gray-500">
                        {iconOptions.find(opt => opt.value === formData.icon)?.label}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
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

export default LightTypes;
