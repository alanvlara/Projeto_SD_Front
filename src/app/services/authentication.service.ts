import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

 authToken: string = '';
 refreshToken: string = '';
 loggedInStatus = new BehaviorSubject<boolean>(false);

  constructor() {}

  setAuthToken(token: string, refresh : string, id : string) {
    this.loggedInStatus.next(true);
    this.authToken = token;
    this.refreshToken = refresh;
    localStorage.setItem('token', token);
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('id', id);
  }

  getAuthToken(): string | null {
    const token = localStorage.getItem('token');
    return token;
  }

  getRefreshAuthToken(): string|null {
    const refreshToken = localStorage.getItem('refresh_token');
    return refreshToken // Implemente esse método no ApiService
  }

  getUserId(): string|null {
    const id = localStorage.getItem('id');
    return id;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getLoggedInStatus() {
    return this.loggedInStatus.asObservable();
  }

  logout() {
    localStorage.clear();
    this.loggedInStatus.next(false);
  }


}
