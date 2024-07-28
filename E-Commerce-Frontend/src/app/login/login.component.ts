import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrected from styleUrl to styleUrls
})
export class LoginComponent implements OnInit {

  hide = true;
  errorMessage: string | null = null; // Added to handle error messages

  clickEvent(event: Event): void {
    event.preventDefault(); 
    event.stopPropagation(); 
    this.hide = !this.hide;
  }

  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.jwtToken);

        const role = response.user.role[0].roleName;
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'Vendor') {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/']);
        }
      },
      (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Incorrect username/password';
        } else {
          console.log(error);
        }
      }
    );
  }

  registerUser() {
    this.router.navigate(['/register']);
  }

  registerVendor() {
    this.router.navigate(['/registerVendor']);
  }
}
