import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor() { }

  public setRoles(roles: string[]) {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  public getRoles(): string[] {
    const roles = localStorage.getItem("roles");
    return roles ? JSON.parse(roles) : [];
  }

  public setToken(jwtToken: string) {
    localStorage.setItem("jwtToken", jwtToken);
  }

  public getToken(): string {
    return localStorage.getItem("jwtToken") || '';
  }

  public clear(){
    localStorage.removeItem("roles");
    localStorage.removeItem("jwtToken");
  }

  public isLoggedIn(): boolean {
    return !!this.getToken(); 
  }
}
