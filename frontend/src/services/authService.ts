import { ApiService, delay } from './apiService';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'SRE' | 'DevOps' | 'Viewer';
}

export interface LoginResult {
  token: string;
  user: UserProfile;
}

export class AuthService extends ApiService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(username: string, password: string): Promise<LoginResult> {
    if (this.isMock()) {
      await delay(120);
      const mockResult: LoginResult = {
        token: 'mock-jwt-token-pulseops-enterprise-2026',
        user: {
          id: 'usr-2',
          username: username || 'sarah',
          email: `${username || 'sarah'}@pulseops.internal`,
          fullName: username === 'admin' ? 'Alex Mercer (Principal Architect)' : 'Sarah Connor (Lead SRE)',
          role: username === 'admin' ? 'Admin' : 'SRE',
        },
      };
      localStorage.setItem('pulseops_token', mockResult.token);
      localStorage.setItem('pulseops_user', JSON.stringify(mockResult.user));
      return mockResult;
    }

    const result = await this.httpPost<LoginResult>('/auth/login', { username, password });
    localStorage.setItem('pulseops_token', result.token);
    localStorage.setItem('pulseops_user', JSON.stringify(result.user));
    return result;
  }

  getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem('pulseops_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('pulseops_token');
    localStorage.removeItem('pulseops_user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('pulseops_token');
  }
}

export const authService = AuthService.getInstance();
