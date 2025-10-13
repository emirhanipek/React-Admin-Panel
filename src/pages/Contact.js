import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getContact, updateContact } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    headerImage: '',
    headerTitle: '',
    headerDesc: '',
    phoneTitle: '',
    phoneValue: '',
    emailTitle: '',
    emailValue: '',
    addressTitle: '',
    addressValue: '',
    workhoursTitle: '',
    workHoursDesc: '',
    facebookLink: '',
    instaLink: '',
    linkedinLink: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const response = await getContact();
      if (response.data.success && response.data.data.length > 0) {
        const data = response.data.data[0];
        setFormData({
          headerImage: data.headerImage ? `${process.env.REACT_APP_BACKEND_URL}/${data.headerImage}` : '',
          headerTitle: data.headerTitle || '',
          headerDesc: data.headerDesc || '',
          phoneTitle: data.phoneTitle || '',
          phoneValue: data.phoneValue || '',
          emailTitle: data.emailTitle || '',
          emailValue: data.emailValue || '',
          addressTitle: data.addressTitle || '',
          addressValue: data.addressValue || '',
          workhoursTitle: data.workhoursTitle || '',
          workHoursDesc: data.workHoursDesc || '',
          facebookLink: data.facebookLink || '',
          instaLink: data.instaLink || '',
          linkedinLink: data.linkedinLink || ''
        });
        toast.success('İletişim bilgileri başarıyla yüklendi!');
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        headerImage: file
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

      await updateContact(formDataToSend);
      toast.success('İletişim bilgileri başarıyla kaydedildi!');
      fetchContactData();
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">İletişim Sayfası Yönetimi</h1>
        <p className="text-gray-600">İletişim sayfanızın içeriğini ve bilgilerini yönetin</p>
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
                onChange={handleFileChange}
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
              name="headerTitle"
              value={formData.headerTitle}
              onChange={handleInputChange}
              placeholder="İletişim başlık metni"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Header Açıklaması</label>
            <textarea
              name="headerDesc"
              value={formData.headerDesc}
              onChange={handleInputChange}
              placeholder="İletişim açıklama metni"
              rows={5}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Telefon Bölümü */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Telefon Bilgileri
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Telefon Başlığı</label>
            <input
              type="text"
              name="phoneTitle"
              value={formData.phoneTitle}
              onChange={handleInputChange}
              placeholder="Telefon başlığı (örn: Telefon Numaramız)"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Telefon Numarası</label>
            <input
              type="tel"
              name="phoneValue"
              value={formData.phoneValue}
              onChange={handleInputChange}
              placeholder="+90 xxx xxx xx xx"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>
        </div>
      </div>

      {/* E-posta Bölümü */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.94a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          E-posta Bilgileri
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">E-posta Başlığı</label>
            <input
              type="text"
              name="emailTitle"
              value={formData.emailTitle}
              onChange={handleInputChange}
              placeholder="E-posta başlığı (örn: E-posta Adresimiz)"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">E-posta Adresi</label>
            <input
              type="email"
              name="emailValue"
              value={formData.emailValue}
              onChange={handleInputChange}
              placeholder="info@example.com"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>
        </div>
      </div>

      {/* Adres Bölümü */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Adres Bilgileri
        </h2>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Adres Başlığı</label>
            <input
              type="text"
              name="addressTitle"
              value={formData.addressTitle}
              onChange={handleInputChange}
              placeholder="Adres başlığı (örn: Ofis Adresimiz)"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Adres</label>
            <textarea
              name="addressValue"
              value={formData.addressValue}
              onChange={handleInputChange}
              placeholder="Tam adres bilgisi"
              rows={4}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Çalışma Saatleri Bölümü */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Çalışma Saatleri
        </h2>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Çalışma Saatleri Başlığı</label>
            <input
              type="text"
              name="workhoursTitle"
              value={formData.workhoursTitle}
              onChange={handleInputChange}
              placeholder="Çalışma saatleri başlığı (örn: Çalışma Saatlerimiz)"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Çalışma Saatleri Açıklaması</label>
            <textarea
              name="workHoursDesc"
              value={formData.workHoursDesc}
              onChange={handleInputChange}
              placeholder="Çalışma saatleriniz hakkında detaylı bilgi"
              rows={4}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Sosyal Medya Bölümü */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Sosyal Medya Linkleri
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
              Facebook Link
            </label>
            <input
              type="url"
              name="facebookLink"
              value={formData.facebookLink}
              onChange={handleInputChange}
              placeholder="https://facebook.com/yourpage"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram Link
            </label>
            <input
              type="url"
              name="instaLink"
              value={formData.instaLink}
              onChange={handleInputChange}
              placeholder="https://instagram.com/yourpage"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn Link
            </label>
            <input
              type="url"
              name="linkedinLink"
              value={formData.linkedinLink}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/company/yourcompany"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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

export default Contact;