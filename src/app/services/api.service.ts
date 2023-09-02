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

  
  baseUrl = 'http://localhost:8000/';


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
    const token = this.authService.getAuthToken(); // esse post nao necessita de token pois é criacao de user
    const httpHeaders = new HttpHeaders({'Content-type': 'application/json'});
    return this.http.post(this.baseUrl + 'accounts/registration/',{
        "username": usuario.nome,
        "email": usuario.email,
        "password1": usuario.senha,
        "password2": usuario.confirmaSenha,
        "esporte" : usuario.esportePreferido,
        "cpf" : usuario.cpf,
        "cep" : usuario.cep,
        "endereco" : usuario.endereco,
        "cidade" : usuario.cidade,
        "estado" : usuario.estado
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
    return this.http.get(this.baseUrl + '/evento/eventos',
    {headers: httpHeaders});
  };

  getUserLogado(): Observable<ApiResponse> {
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({'Content-type': 'application/json', Authorization: `Bearer ${token}`});
    return this.http.get<ApiResponse>(this.baseUrl + '/accounts/user/', { headers: httpHeaders });
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
    return this.http.post<any>(this.baseUrl + '/atividade/atividades/', atividade, { headers: httpHeaders })
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

  confirmEmail(key: any){
    return this.http.post(this.baseUrl + '/accounts/registration/verify-email/',{"key": key}, {});
  }

  
}
