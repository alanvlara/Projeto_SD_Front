import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { SobreComponent } from './components/sobre/sobre.component';
import { AtividadesComponent } from './components/atividades/atividades.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './services/auth-guard';
import { ConfiguracoesComponent } from './components/configuracoes/configuracoes.component';
import { HomeGuard } from './services/home-guard';
import { AtividadeDetailComponent } from './components/atividade-detail/atividade-detail.component';
import { CriaEventoComponent } from './components/cria-evento/cria-evento.component';
// import { MeusEventosComponent } from './components/meus-eventos/meus-eventos.component';
import { CriaAtividadeComponent } from './components/cria-atividade/cria-atividade.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent, canActivate: [HomeGuard] },
  { path: 'cadastro', component : CadastroComponent },
  { path: 'perfil', component : PerfilComponent, canActivate: [AuthGuard] },
  { path: 'ranking', component : RankingComponent, canActivate: [AuthGuard] },
  {path: 'criar-evento', component : CriaEventoComponent, canActivate: [AuthGuard] },
  {path: 'eventos', component : EventosComponent, canActivate: [AuthGuard] },
  // {path: 'meus-eventos', component : MeusEventosComponent, canActivate: [AuthGuard] },
  { path: 'sobre', component : SobreComponent},
  { path: 'configuracoes', component : ConfiguracoesComponent, canActivate: [AuthGuard]},
  { path: 'criar-atividade', component : CriaAtividadeComponent, canActivate: [AuthGuard]},
  { path: 'atividades', component : AtividadesComponent, canActivate: [AuthGuard]},
  {path: 'atividades/:id', component : AtividadeDetailComponent, canActivate: [AuthGuard]},
  {path: 'confirm-email/:key', component : ConfirmEmailComponent},
  { path: 'not-found', component : NotFoundComponent},
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
