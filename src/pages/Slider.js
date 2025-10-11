import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllSliders, createSlider, updateSlider, deleteSlider } from '../services/api';

const Slider = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [formData, setFormData] = useState({
    sliderImage: null,
    sliderTitle: '',
    sliderDesc: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await getAllSliders();
      if (response.data.success) {
        // Görsel URL'lerini backend base URL ile birleştir
        const slidersWithFullUrls = response.data.data.map(slider => ({
          ...slider,
          sliderImage: `http://localhost:3000/${slider.sliderImage}`
        }));
        setSliders(slidersWithFullUrls);
        toast.success('Slider\'lar başarıyla yüklendi!');
      }
    } catch (error) {
      console.error('Slider\'lar yüklenirken hata:', error);
      toast.error('Slider\'lar yüklenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        sliderImage: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openModal = (slider = null) => {
    if (slider) {
      setEditingSlider(slider);
      setFormData({
        sliderImage: null,
        sliderTitle: slider.sliderTitle || '',
        sliderDesc: slider.sliderDesc || ''
      });
      setImagePreview(slider.sliderImage || null);
    } else {
      setEditingSlider(null);
      setFormData({
        sliderImage: null,
        sliderTitle: '',
        sliderDesc: ''
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSlider(null);
    setFormData({
      sliderImage: null,
      sliderTitle: '',
      sliderDesc: ''
    });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      if (formData.sliderImage) {
        formDataToSend.append('sliderImage', formData.sliderImage);
      }
      formDataToSend.append('sliderTitle', formData.sliderTitle);
      formDataToSend.append('sliderDesc', formData.sliderDesc);

      if (editingSlider) {
        await updateSlider(editingSlider.id, formDataToSend);
        toast.success('Slider başarıyla güncellendi!');
      } else {
        if (!formData.sliderImage) {
          toast.error('Lütfen bir görsel seçin!');
          return;
        }
        await createSlider(formDataToSend);
        toast.success('Slider başarıyla oluşturuldu!');
      }

      closeModal();
      fetchSliders();
    } catch (error) {
      console.error('Slider kaydedilirken hata:', error);
      toast.error('Slider kaydedilirken bir hata oluştu!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu slider\'ı silmek istediğinize emin misiniz?')) {
      try {
        await deleteSlider(id);
        toast.success('Slider başarıyla silindi!');
        fetchSliders();
      } catch (error) {
        console.error('Slider silinirken hata:', error);
        toast.error('Slider silinirken bir hata oluştu!');
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Slider Yönetimi</h1>
          <p className="text-gray-600">Anasayfa slider görsellerini yönetin</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Yeni Slider Ekle</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map((slider) => (
          <div key={slider.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <div className="aspect-video w-full overflow-hidden bg-gray-200">
              <img
                src={slider.sliderImage}
                alt={slider.sliderTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{slider.sliderTitle}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{slider.sliderDesc}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(slider)}
                  className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => handleDelete(slider.id)}
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Sil</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sliders.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-lg">Henüz slider eklenmemiş</p>
          <p className="text-gray-400 text-sm mt-2">Yeni slider eklemek için yukarıdaki butona tıklayın</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingSlider ? 'Slider Düzenle' : 'Yeni Slider Ekle'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Slider Görseli {!editingSlider && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                  />
                  {imagePreview && (
                    <div className="mt-4 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-auto" />
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Başlık <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sliderTitle"
                    value={formData.sliderTitle}
                    onChange={handleInputChange}
                    placeholder="Slider başlığı"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Açıklama <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="sliderDesc"
                    value={formData.sliderDesc}
                    onChange={handleInputChange}
                    placeholder="Slider açıklaması"
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  {editingSlider ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;
