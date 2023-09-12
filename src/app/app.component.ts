import {  Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'projeto-final-front'
  mostraEventosBotao = false;
  mostraHomeBotao = true;
  darkMode = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private api: ApiService,
    // private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    this.authService.loggedInStatus.next(loggedIn);
    this.authService.getLoggedInStatus().subscribe(loggedIn => {
      this.mostraEventosBotao = loggedIn;
      this.mostraHomeBotao = !loggedIn;
    });
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.darkMode = savedTheme === 'dark';
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    const theme = this.darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme); // Salva o tema no armazenamento local
  }

  navigateToProfile() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.router.navigate(['perfil/']);
    } else {
      this.router.navigate(['not-found']);
    }
  }

  goToConfiguracoes() {
    this.router.navigate(['configuracoes/']);
  }

  sair() {
    this.api.postLogOutUser().subscribe({
      next: () => this.onLogoutSuccess(),
      error: error => this.onLogoutError(error),
      complete: () => console.log('Logout completed')
    });
  }

  private onLogoutSuccess() {
    this.authService.logout();
    this.router.navigate(['home/']);
  }

  private onLogoutError(error: any) {
    console.error('Erro ao fazer logout:', error);
  }
}