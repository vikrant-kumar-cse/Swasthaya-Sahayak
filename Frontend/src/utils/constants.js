// ========== 2. src/utils/constants.js ==========
export const API_URL = 'http://localhost:8080/api/outbreaks';

export const DISTRICTS = [
  'Kolkata', 'Mumbai', 'Delhi', 'Chennai', 'Bangalore',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
];

export const DISEASES = [
  'Dengue', 'Malaria', 'Typhoid', 'Cholera', 
  'COVID-19', 'Tuberculosis', 'Hepatitis', 'Influenza'
];

export const ALERT_LEVEL_COLORS = {
  CRITICAL: {
    bg: 'bg-red-500',
    border: 'border-red-500',
    text: 'text-red-700',
    light: 'bg-red-100',
    badge: 'bg-red-100 text-red-800'
  },
  WARNING: {
    bg: 'bg-yellow-500',
    border: 'border-yellow-500',
    text: 'text-yellow-700',
    light: 'bg-yellow-100',
    badge: 'bg-yellow-100 text-yellow-800'
  },
  NORMAL: {
    bg: 'bg-green-500',
    border: 'border-green-500',
    text: 'text-green-700',
    light: 'bg-green-100',
    badge: 'bg-green-100 text-green-800'
  }
};

export const CHART_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

