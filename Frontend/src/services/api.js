const API_URL = 'http://localhost:8080/api/outbreaks';

export const apiService = {
  async getStats() {
    try {
      const response = await fetch(`${API_URL}/stats`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch stats`);
      const data = await response.json();
      console.log('📊 Stats API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Stats API Error:', error);
      throw error;
    }
  },

  async getAllOutbreaks() {
    try {
      const response = await fetch(`${API_URL}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch outbreaks`);
      const data = await response.json();
      
      // ✅ Handle both "count" and "results" field names
      const normalizedData = {
        status: data.status,
        count: data.count || data.results || 0,
        data: data.data || []
      };
      
      console.log('📋 Outbreaks API Response:', normalizedData);
      return normalizedData;
    } catch (error) {
      console.error('❌ Outbreaks API Error:', error);
      throw error;
    }
  },

  async checkOutbreak(district, disease) {
    try {
      const response = await fetch(
        `${API_URL}/check?district=${encodeURIComponent(district)}&disease=${encodeURIComponent(disease)}`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to check outbreak`);
      const data = await response.json();
      console.log('🔍 Check Outbreak Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Check Outbreak Error:', error);
      throw error;
    }
  },

  async runDailyCheck() {
    try {
      const response = await fetch(`${API_URL}/daily-check`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to run daily check`);
      const data = await response.json();
      console.log('📅 Daily Check Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Daily Check Error:', error);
      throw error;
    }
  },

  async generateMockData() {
    try {
      const response = await fetch(`${API_URL}/generate-mock-data`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to generate mock data`);
      const data = await response.json();
      console.log('🎲 Mock Data Generated:', data);
      return data;
    } catch (error) {
      console.error('❌ Generate Mock Data Error:', error);
      throw error;
    }
  }
};
