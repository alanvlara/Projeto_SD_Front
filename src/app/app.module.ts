import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http'
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth-interceptor';
import { AtividadesComponent } from './components/atividades/atividades.component';
import { AtividadeDetailComponent } from './components/atividade-detail/atividade-detail.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { ConfiguracoesComponent } from './components/configuracoes/configuracoes.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { CriaAtividadeComponent } from './components/cria-atividade/cria-atividade.component';
import { CriaEventoComponent } from './components/cria-evento/cria-evento.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { SobreComponent } from './components/sobre/sobre.component';
import { RankingComponent } from './components/ranking/ranking.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AtividadesComponent,
    AtividadeDetailComponent,
    CadastroComponent,
    ConfiguracoesComponent,
    ConfirmEmailComponent,
    CriaAtividadeComponent,
    CriaEventoComponent,
    EventosComponent,
    NotFoundComponent,
    PerfilComponent,
    SobreComponent,
    RankingComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [{
    provide: {HTTP_INTERCEPTORS},
      useClass: AuthInterceptor,
      multi: true,
  },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
