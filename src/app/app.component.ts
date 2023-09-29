import {  Component, OnInit, ViewChild } from '@angular/core';
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
    this.setTheme(savedTheme); // Chama a função para configurar o tema
  } else {
    // Define o tema padrão caso não haja um tema armazenado
    this.setTheme('light'); // Ou 'dark', dependendo do seu tema padrão
  }
  }

  private setTheme(theme: string) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme); // Salva o tema no armazenamento local
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    const theme = this.darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
    this.setTheme(theme); // Salva o tema no armazenamento local
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
      error: error => {
        this.onLogoutError(error)
        if (error.status === 401) {
          // Erro 401 (não autorizado) recebido

          // Realize o logout local (exemplo: remova o token de autenticação)
          localStorage.clear();

          //navegue para home
          this.router.navigate(['/home']);
        }
      },
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