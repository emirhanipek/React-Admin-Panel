import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----- Products -----
export const getAllProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data,
{
  headers: {
    'Content-Type': 'multipart/form-data',
  }
}
);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);


export const getAllCategories = () => api.get('/category');
export const getCategoryById = (id) => api.get(`/category/${id}`);
export const createCategory = (data) => api.post('/category', data);
export const updateCategory = (id, data) => api.put(`/category/${id}`, data);
export const deleteCategory = (id) => api.delete(`/category/${id}`);

// ----- About -----
export const getAbout = () => api.get('/about');
export const updateAbout = (data) => api.put('/about', data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// ----- Contact -----
export const getContact = () => api.get('/contact');
export const updateContact = (data) => api.put('/contact', data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});


// -----BRAND-----
export const getAllBrands = () => api.get('/brands');
export const createBrand = (data) => api.post('/brands', data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const updateBrand = (id, data) => api.put(`/brands/${id}`, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const deleteBrand = (id) => api.delete(`/brands/${id}`);

// ----- Light Types -----
export const getAllLightTypes = () => api.get('/signboards/light_types');
export const createLightType = (data) => api.post('/signboards/light_types', data);
export const updateLightType = (id, data) => api.put(`/signboards/light_types/${id}`, data);
export const deleteLightType = (id) => api.delete(`/signboards/light_types/${id}`);

// ----- Front Materials -----
export const getAllFrontMaterials = () => api.get('/signboards/front_materials');
export const createFrontMaterial = (data) => api.post('/signboards/front_materials', data);
export const updateFrontMaterial = (id, data) => api.put(`/signboards/front_materials/${id}`, data);
export const deleteFrontMaterial = (id) => api.delete(`/signboards/front_materials/${id}`);

// ----- Letter Heights -----
export const getAllLetterHeights = () => api.get('/signboards/letter_heights');
export const createLetterHeight = (data) => api.post('/signboards/letter_heights', data);
export const updateLetterHeight = (id, data) => api.put(`/signboards/letter_heights/${id}`, data);
export const deleteLetterHeight = (id) => api.delete(`/signboards/letter_heights/${id}`);

// ----- Background Colors -----
export const getAllBackgroundColors = () => api.get('/signboards/background_colors');
export const createBackgroundColor = (data) => api.post('/signboards/background_colors', data);
export const updateBackgroundColor = (id, data) => api.put(`/signboards/background_colors/${id}`, data);
export const deleteBackgroundColor = (id) => api.delete(`/signboards/background_colors/${id}`);

// ----- Signboards -----
export const updateSignboardAction = (id, data) => api.patch(`/signboards/${id}/action`, data);

// ----- Slider -----
export const getAllSliders = () => api.get('/slider');
export const getSliderById = (id) => api.get(`/slider/${id}`);
export const createSlider = (data) => api.post('/slider', data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const updateSlider = (id, data) => api.put(`/slider/${id}`, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const deleteSlider = (id) => api.delete(`/slider/${id}`);

export default api;
