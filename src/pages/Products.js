import { useEffect, useState } from "react";
import { getAllProducts, getAllCategories, createProduct, updateProduct, deleteProduct } from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      console.log("Fetched products:", response.data);
      const productsData = response.data.data || response.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      const categoriesData = response.data.data || response.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('category_id', formData.category_id);

      if (formData.image) {
        submitData.append('image_url', formData.image);
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, submitData);
      } else {
        await createProduct(submitData);
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category_id: product.category_id || '',
      image: null
    });
    setIsModalOpen(true);
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image: null
    });
    setImagePreview(null);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category_id === parseInt(filterCategory);
    const matchesStatus = filterStatus === 'All' || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getCategoryName = (product) => {
    // Önce product'tan gelen category_name'i kullan
    if (product.category_name) {
      return product.category_name;
    }
    // Yoksa categories listesinden bul
    const category = categories.find(cat => cat.id === product.category_id);
    return category ? category.name : 'Unknown';
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-500 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-500 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.status === 'Active').length}</p>
              <p className="text-sm text-gray-600">Active Products</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-orange-500 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.stock < 20).length}</p>
              <p className="text-sm text-gray-600">Low Stock</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-500 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              {/* <p className="text-2xl font-bold text-gray-900">{formatPrice(products.reduce((sum, p) => sum + (p.price * p.sales), 0))}</p> */}
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
  {loading ? (
    <div className="col-span-full flex justify-center py-12">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ) : filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <div
        key={product.id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Görsel */}
        <div className="relative w-full h-64 bg-gray-200">
          {product.images && product.images.length > 0 ? (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}${product.images[0].image_url}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-1">{product.description}</p>
          <p className="text-lg font-bold text-blue-600 mb-3">
            {parseFloat(product.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </p>
          <div className="flex gap-2">
            <button onClick={() => handleEdit(product)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition-colors">
              Düzenle
            </button>
            <button onClick={() => handleDelete(product.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm transition-colors">
              Sil
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="text-center py-12 col-span-full">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
      <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
    </div>
  )}
</div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ürün Adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ürün adını girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Ürün açıklaması"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div className="grid">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fiyat
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="0.00"
                    required
                  />
                  </div>
                 <div className="grid">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Görsel
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG veya JPEG (Max. 5MB)</p>

                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Önizleme"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setIsImageModalOpen(true)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {editingProduct ? 'Güncelle' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {isImageModalOpen && imagePreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-screen p-4">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-6 right-6 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={imagePreview}
              alt="Büyük Önizleme"
              className="max-w-full max-h-screen object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
