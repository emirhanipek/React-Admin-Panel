import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAbout, updateAbout } from '../services/api';

const About = () => {
  const [formData, setFormData] = useState({
    headerImage: '',
    headerText: '',
    headerDescription: '',
    storyTitle: '',
    storyImage: '',
    storyDesc: '',
    misyonTitle: '',
    misyonDescription: '',
    visyonTitle: '',
    vizyonDescription: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await getAbout();
      if (response.data.success && response.data.data.length > 0) {
        const data = response.data.data[0];
        setFormData({
          headerImage: data.headerImage ? `http://localhost:3000/${data.headerImage}` : '',
          headerText: data.headerText || '',
          headerDescription: data.headerDescription || '',
          storyTitle: data.storyTitle || '',
          storyImage: data.storyImage ? `http://localhost:3000/${data.storyImage}` : '',
          storyDesc: data.storyDesc || '',
          misyonTitle: data.misyonTitle || '',
          misyonDescription: data.misyonDescription || '',
          visyonTitle: data.visyonTitle || '',
          vizyonDescription: data.vizyonDescription || ''
        });
        toast.success('Veriler başarıyla yüklendi!');
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      toast.error('Veriler yüklenirken bir hata oluştu!');
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

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();

      // Tüm form verilerini FormData'ya ekle
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await updateAbout(formDataToSend);
      toast.success('Veriler başarıyla kaydedildi!');
      fetchAboutData();
    } catch (error) {
      console.error('Veri kaydedilirken hata:', error);
      toast.error('Veriler kaydedilirken bir hata oluştu!');
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
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hakkımızda Sayfası Yönetimi</h1>
        <p className="text-gray-600">Kurumsal hakkımızda sayfanızın içeriğini yönetin</p>
      </div>

      {/* Header Bölümü */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Header Bölümü
        </h2>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Header Görseli</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'headerImage')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
              />
              {formData.headerImage && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={formData.headerImage instanceof File ? URL.createObjectURL(formData.headerImage) : formData.headerImage}
                    alt="Header"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Header Başlığı</label>
            <input
              type="text"
              name="headerText"
              value={formData.headerText}
              onChange={handleInputChange}
              placeholder="Ana başlık metni"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Header Açıklaması</label>
            <textarea
              name="headerDescription"
              value={formData.headerDescription}
              onChange={handleInputChange}
              placeholder="Header açıklama metni"
              rows={5}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Hikaye Bölümü */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Hikayemiz
        </h2>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Hikaye Başlığı</label>
            <input
              type="text"
              name="storyTitle"
              value={formData.storyTitle}
              onChange={handleInputChange}
              placeholder="Hikayemiz başlığı"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Hikaye Görseli</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'storyImage')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-colors"
              />
              {formData.storyImage && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={formData.storyImage instanceof File ? URL.createObjectURL(formData.storyImage) : formData.storyImage}
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Hikaye Açıklaması</label>
            <textarea
              name="storyDesc"
              value={formData.storyDesc}
              onChange={handleInputChange}
              placeholder="Hikaye açıklama metni (Paragraflar arasında boşluk bırakmak için Enter tuşuna basın)"
              rows={8}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
            <p className="mt-2 text-sm text-gray-500">
              İpucu: Paragraflar arasında boşluk bırakmak için Enter tuşuna basın.
            </p>
          </div>
        </div>
      </div>

      {/* Misyon Bölümü */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Misyonumuz
        </h2>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Misyon Başlığı</label>
            <input
              type="text"
              name="misyonTitle"
              value={formData.misyonTitle}
              onChange={handleInputChange}
              placeholder="Misyon başlığı"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Misyon Açıklaması</label>
            <textarea
              name="misyonDescription"
              value={formData.misyonDescription}
              onChange={handleInputChange}
              placeholder="Misyon açıklama metni"
              rows={5}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Vizyon Bölümü */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Vizyonumuz
        </h2>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Vizyon Başlığı</label>
            <input
              type="text"
              name="visyonTitle"
              value={formData.visyonTitle}
              onChange={handleInputChange}
              placeholder="Vizyon başlığı"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Vizyon Açıklaması</label>
            <textarea
              name="vizyonDescription"
              value={formData.vizyonDescription}
              onChange={handleInputChange}
              placeholder="Vizyon açıklama metni"
              rows={5}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Kaydet Butonu */}
      <div className="flex justify-end mt-12">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-10 rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Değişiklikleri Kaydet</span>
        </button>
      </div>
    </div>
  );
};

export default About;