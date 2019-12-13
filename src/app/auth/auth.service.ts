import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isLogin = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getAuthStatus() {
    return this.isLogin;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  creatUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData = {email, password};
    this.http.post<{token: string}>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          this.isLogin = true;
          this.authStatusListener.next(true);
        }
      });
  }

  getToken(): string {
    return this.token;
  }

  logout() {
    this.isLogin = false;
    this.authStatusListener.next(false);
  }
}
