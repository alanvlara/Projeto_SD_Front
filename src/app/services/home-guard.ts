import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard {

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Se o usuário está logado, redireciona para /perfil
      this.router.navigate(['/perfil']);
      return false; // Nega o acesso à rota /home
    }
    return true; // Permite o acesso à rota /home se o usuário não estiver logado
  }
}
