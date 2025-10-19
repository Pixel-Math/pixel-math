/**
 * API Client para Cálculo Digital 2
 * Gerencia autenticação e progresso de leitura
 */

const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  /**
   * Faz uma requisição HTTP para a API
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Adicionar token de autenticação se disponível
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // ==================== AUTENTICAÇÃO ====================

  /**
   * Registra um novo usuário
   */
  async register(username, email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    this.setAuth(data.access_token, data.user);
    return data;
  }

  /**
   * Faz login
   */
  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    this.setAuth(data.access_token, data.user);
    return data;
  }

  /**
   * Faz logout
   */
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  /**
   * Define autenticação
   */
  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Verifica se está autenticado
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Obtém usuário atual
   */
  async getCurrentUser() {
    const data = await this.request('/auth/me');
    this.user = data.user;
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  }

  // ==================== PROGRESSO DE LEITURA ====================

  /**
   * Obtém todo o progresso de leitura
   */
  async getAllProgress() {
    const data = await this.request('/progress');
    return data.progress;
  }

  /**
   * Obtém progresso de um capítulo específico
   */
  async getChapterProgress(chapterKey) {
    const data = await this.request(`/progress/${encodeURIComponent(chapterKey)}`);
    return data.progress;
  }

  /**
   * Salva progresso de um capítulo
   */
  async saveProgress(chapterKey, progress, lastPosition = 0, completed = false) {
    const data = await this.request(`/progress/${encodeURIComponent(chapterKey)}`, {
      method: 'POST',
      body: JSON.stringify({
        progress,
        last_position: lastPosition,
        completed,
      }),
    });
    return data.progress;
  }

  /**
   * Deleta progresso de um capítulo
   */
  async deleteProgress(chapterKey) {
    const data = await this.request(`/progress/${encodeURIComponent(chapterKey)}`, {
      method: 'DELETE',
    });
    return data;
  }

  // ==================== UTILIDADES ====================

  /**
   * Verifica status da API
   */
  async healthCheck() {
    const data = await this.request('/health');
    return data;
  }

  // ==================== PROGRESSO GERAL ====================

  /**
   * Obtém progresso geral persistido do usuário
   */
  async getOverallProgress() {
    const data = await this.request('/progress/overall');
    return data.overall;
  }
}

// Exportar instância única
const apiClient = new ApiClient();
