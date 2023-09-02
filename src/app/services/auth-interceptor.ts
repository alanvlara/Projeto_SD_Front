import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { ApiService } from './api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private api: ApiService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //pegar token e adicionar na header se tiver
    const authToken = this.authService.getAuthToken();
    if (authToken) {
      request = this.addTokenToRequest(request, authToken);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        //interceptar e lidar com erros 401
        if (error.status === 401) {
          return this.handleUnauthorizedError(request, next);
        }

        // If not a 401 error, propagate the error
        return throwError(error);
      })
    );
  }

  private addTokenToRequest(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleUnauthorizedError(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //Refresh token e tentar a requisição de novo
    return this.api.refreshToken(this.authService.getRefreshAuthToken()).pipe(
      switchMap((data: any) => {
        if (data.access) {
          // Update token no local storage
          localStorage.setItem('token', data.access);

          // Clone the request and add the new token
          const updatedRequest = this.addTokenToRequest(
            request,
            data.access
          );

          // Tentar requisicao com novo token
          return next.handle(updatedRequest);
        } else {
          // Logout
          this.authService.logout();
          return throwError('Failed to refresh token');
        }
      }),
      catchError((error: any) => {
        // Logout
        this.authService.logout();
        return throwError('Failed to refresh token');
      })
    );
  }
}
