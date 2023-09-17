import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private api: ApiService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      const authToken = this.authService.getAuthToken();
      // console.log('Tenho token: ', authToken);
      if (authToken) {
        const isTokenValid = this.isTokenValid();
        if (isTokenValid) {
          return of(true);
        } else {
          // console.log("Token não está mais válido, vou usar refresh");
          return this.api.refreshToken(this.authService.getRefreshAuthToken()).pipe(
            switchMap((data: any) => {
              if (data.access) {
                // console.log("Consegui novo token: ", data.access);
                localStorage.setItem('token', data.access);
                return of(true);
              } else {
                this.authService.logout();
                this.router.navigate(['/home']);
                return of(false);
              }
            }),
            catchError((error: any) => {
              console.log(error);
              this.authService.logout();
              this.router.navigate(['/home']);
              return of(false);
            })
          );
        }
      }
      return of(true);
    } else {
      // Se o usuário não está logado, não permite o acesso à rota e direciona para not-found
      this.router.navigate(['/not-found']);
      return of(false);
    }
  }

  isTokenValid(): boolean{
    of(this.api.verifyToken().subscribe({
      next: () => {
        // console.log('sucesso')
        return true},
      error: error => {
        console.log(error);
        return false;
      }
    }))
    return false
  }


}
