// API Configuration
// Use 192.168.1.78 (your computer's IP) for iOS Simulator to connect to local backend
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.78:3000/api' 
  : 'https://your-production-api.com/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  clearAuthToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth APIs
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Experience APIs
  async getExperiences(params?: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) {
    const queryString = params 
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.request(`/experiences${queryString}`);
  }

  async getExperience(id: string) {
    return this.request(`/experiences/${id}`);
  }

  async getTrendingExperiences() {
    return this.request('/experiences/trending');
  }

  // Booking APIs
  async createBooking(bookingData: {
    experienceId: string;
    date: string;
    time: string;
    participants: number;
    totalAmount: number;
  }) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getMyBookings() {
    return this.request('/bookings/my');
  }

  async getBooking(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async cancelBooking(id: string) {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
  }

  // Review APIs
  async getExperienceReviews(experienceId: string) {
    return this.request(`/reviews/experience/${experienceId}`);
  }

  async createReview(reviewData: {
    experienceId: string;
    rating: number;
    comment: string;
  }) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Saved Experiences APIs
  async saveExperience(experienceId: string) {
    return this.request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ experienceId }),
    });
  }

  async unsaveExperience(experienceId: string) {
    return this.request(`/favorites/${experienceId}`, {
      method: 'DELETE',
    });
  }

  async getSavedExperiences() {
    return this.request('/favorites');
  }

  async checkIfSaved(experienceId: string) {
    return this.request(`/favorites/check/${experienceId}`);
  }

  // Profile APIs
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(userData: {
    name?: string;
    phone?: string;
    bio?: string;
  }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
}

export const api = new ApiService();
export default api;
