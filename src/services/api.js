import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    "Content-Type": "application/json",
  },
});

// ----- Products -----
export const getAllProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);


export const getAllCategories = () => api.get('/category');
export const getCategoryById = (id) => api.get(`/category/${id}`);
export const createCategory = (data) => api.post('/category', data);
export const updateCategory = (id, data) => api.put(`/category/${id}`, data);
export const deleteCategory = (id) => api.delete(`/category/${id}`);

// ----- About -----
export const getAbout = () => api.get('/about');
export const updateAbout = (data) => api.put('/about', data);

// ----- Contact -----
export const getContact = () => api.get('/contact');
export const updateContact = (data) => api.put('/contact', data);

export default api;
