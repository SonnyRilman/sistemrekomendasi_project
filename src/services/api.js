/**
 * API Service for connecting to Flask Backend
 * Base URL should be updated to match your Flask server (e.g., http://localhost:5000)
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiService = {
  /**
   * Fetch all products or filtered products
   */
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${BASE_URL}/api/products?${query}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('API Error (getProducts):', error);
      throw error;
    }
  },

  /**
   * Get product details by ID
   */
  async getProductById(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      return await response.json();
    } catch (error) {
      console.error('API Error (getProductById):', error);
      throw error;
    }
  },

  /**
   * POST preferences to get recommendations
   * @param {Object} preferences - { category, brand, skinType, shade, priceRange }
   */
  async getRecommendations(preferences) {
    try {
      const response = await fetch(`${BASE_URL}/api/recommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return await response.json();
    } catch (error) {
      console.error('API Error (getRecommendations):', error);
      throw error;
    }
  }
};
