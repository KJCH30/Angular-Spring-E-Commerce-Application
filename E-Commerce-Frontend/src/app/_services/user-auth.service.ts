import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public setRoles(roles: string[]) {
    if (this.isBrowser()) {
      localStorage.setItem("roles", JSON.stringify(roles));
    }
  }

  public getRoles(): string[] {
    if (this.isBrowser()) {
      const roles = localStorage.getItem("roles");
      return roles ? JSON.parse(roles) : [];
    }
    return [];
  }

  public setToken(jwtToken: string) {
    if (this.isBrowser()) {
      localStorage.setItem("jwtToken", jwtToken);
    }
  }

  public getToken(): string {
    if (this.isBrowser()) {
      return localStorage.getItem("jwtToken") || '';
    }
    return '';
  }

  public clear() {
    if (this.isBrowser()) {
      localStorage.removeItem("roles");
      localStorage.removeItem("jwtToken");
    }
  }

  public isLoggedIn(): boolean {
    return this.isBrowser() && !!this.getToken();
  }

  public isVendor(): boolean {
    const roles: any[] = this.getRoles();
    return roles.length > 0 && roles[0].roleName === 'Vendor';
  }

  public isUser(): boolean {
    const roles: any[] = this.getRoles();
    return roles.length > 0 && roles[0].roleName === 'User';
  }

  public isAdmin(): boolean {
    const roles: any[] = this.getRoles();
    return roles.length > 0 && roles[0].roleName === 'Admin';
  }
}
