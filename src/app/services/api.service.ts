import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { ApiResponse } from './api-response-model';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(
    private http : HttpClient,
    private authService: AuthenticationService,
    ) { }

  
  // baseUrl = 'https://web-production-043b.up.railway.app/';
  baseUrl = 'http://localhost:8000/'


  postLoginUser(usuario: any){
    return this.http.post(this.baseUrl + 'accounts/login/',{
        "username": usuario.nome,
        "email": usuario.email,
        "password": usuario.senha
  }, {});
  };

  postLogOutUser() {
    const token = this.authService.getAuthToken();
    const httpHeaders = new HttpHeaders({'Content-type': 'application/json', Authorization: `Bearer ${token}`});
    return this.http.post(this.baseUrl + 'accounts/logout/', null, { headers: httpHeaders });
  }

  postResendEmail(email: string){
    return this.http.post(this.baseUrl + 'accounts/registration/resend-email/', { 'email': email });
  }

  refreshToken(refresh_token: string | null) {
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({'Content-type': 'application/json', Authorization: `Bearer ${token}`});
    const refreshToken = refresh_token;
    return this.http.post(this.baseUrl + 'accounts/token/refresh/', {'refresh':refreshToken}, {} );
  }

  verifyToken(){
    const token = localStorage.getItem('token');
    return this.http.post(this.baseUrl + 'accounts/token/verify/', {'token':token}, {} );
  }

  postUser(usuario: any){
    const httpHeaders = new HttpHeaders({'Content-type': 'application/json'})
    console.log(usuario)
    return this.http.post(this.baseUrl + 'accounts/registration/',{
        "username": usuario.username,
        "first_name" : usuario.nome,
        "last_name" : usuario.sobrenome,
        "email": usuario.email,
        "password1": usuario.senha,
        "password2": usuario.confirmaSenha,
        "esportePreferido" : usuario.esportePreferido,
        "cpf" : usuario.cpf,
        "cep" : usuario.cep,
        "endereco" : usuario.endereco,
        "cidade" : usuario.cidade,
        "estado" : usuario.estado,
        "representa" : usuario.representa,
        "quer_criar" : usuario.querCriar
    }, {headers: httpHeaders});
  }

  putUser(formData: FormData, id: string|null) {
    const token = this.authService.getAuthToken();
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(this.baseUrl + `usuario/usuarios/${id}/`, formData, { headers: httpHeaders });
  }

  getAllEventos(): Observable<any>{
    const token = this.authService.getAuthToken();
    const httpHeaders = new HttpHeaders({'Content-type': 'application/json', Authorization: `Bearer ${token}`});
    return this.http.get(this.baseUrl + 'evento/eventos',
    {headers: httpHeaders});
  };

  getEventoById(id: string|null){
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({'Content-type': 'application/json', Authorization: `Bearer ${token}`});
    return this.http.get<any>(this.baseUrl + 'evento/eventos/'+id+'/', {headers: httpHeaders})
  }

  getUserLogado(): Observable<ApiResponse> {
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({'Content-type': 'application/json', Authorization: `Bearer ${token}`});
    return this.http.get<ApiResponse>(this.baseUrl + 'accounts/user/', { headers: httpHeaders });
  }

  getAllUsers(){
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({'Content-type': 'application/json', Authorization: `Bearer ${token}`});
    return this.http.get<any>(this.baseUrl + 'usuario/usuarios/', {headers: httpHeaders})
  }

  getAtividades(){
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({'Content-type': 'application/json', Authorization: `Bearer ${token}`});
    return this.http.get<any>(this.baseUrl + 'atividade/atividades/', {headers: httpHeaders})
  }

  postAtividade(atividade: FormData){
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.post<any>(this.baseUrl + 'atividade/atividades/', atividade, { headers: httpHeaders })
  }

  getAtividadeById(id: string|null){
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({'Content-type': 'application/json', Authorization: `Bearer ${token}`});
    return this.http.get<any>(this.baseUrl + 'atividade/atividades/'+id+'/', {headers: httpHeaders})
  }

  postEvento(evento: FormData){
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.post(this.baseUrl + 'evento/eventos/', evento, {headers: httpHeaders})
  }

  putEvento(evento: FormData, id: any){
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.put(this.baseUrl + `evento/eventos/${id}/`, evento, {headers: httpHeaders})
  }

  deleteEvento(id: any){
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.delete(this.baseUrl + `evento/eventos/${id}/`, {headers: httpHeaders})
  }

  confirmEmail(key: any){
    const token = localStorage.getItem('token');
    return this.http.post(this.baseUrl + 'accounts/registration/verify-email/',{"key": key}, {});
  }

  exportarDadosParaExcel(id:any){
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.get(this.baseUrl + `evento/exportar_excel/${id}/`,  {
      headers: httpHeaders,
      responseType: 'blob'
  });
  }

  gerarPDFAtividade(atividadeId: any){
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.get(this.baseUrl + `atividade/gerar_certificado/${atividadeId}/`, {
        headers: httpHeaders,
        responseType: 'blob'
    });
}

  
}
