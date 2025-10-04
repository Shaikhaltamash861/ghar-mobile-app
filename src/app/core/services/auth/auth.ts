import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { API_BASE_URL } from 'src/app/app.constant';
// import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
  role: 'tenant' | 'owner';
  rememberMe: boolean;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = API_BASE_URL;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkStoredAuth();
  }

  login(loginData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  async googleLogin(role: string): Promise<AuthResponse> {
    throw new Error('Google login not implemented yet');
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/auth/forgot-password`, { email })
      );
    } catch (error: any) {
      throw new Error(error.error?.message || 'Failed to send reset email');
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private checkStoredAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');

    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
}
