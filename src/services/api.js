/**
 * API Service for connecting to Flask Backend
 * Base URL should be updated to match your Flask server (e.g., http://localhost:5000)
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiService = {
  /**
   * Fetch all products from backend
   */
  async getProducts() {
    try {
      const response = await fetch(`${BASE_URL}/api/products/`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('API Error (getProducts):', error);
      throw error;
    }
  },

  /**
   * POST preferences to get recommendations
   * @param {Object} data - { kategori_produk, rating, pilihan_ingredients, budget_max }
   */
  async getRecommendations(data) {
    try {
      const response = await fetch(`${BASE_URL}/api/preprocessing/rekomendasi_start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return await response.json();
    } catch (error) {
      console.error('API Error (getRecommendations):', error);
      throw error;
    }
  },
  /**
   * Fetch evaluation metrics from backend
   */
  async getEvaluation() {
    try {
      const response = await fetch(`${BASE_URL}/api/evaluate`);
      if (!response.ok) throw new Error('Failed to fetch evaluation');
      return await response.json();
    } catch (error) {
      console.error('API Error (getEvaluation):', error);
      throw error;
    }
  }
};

