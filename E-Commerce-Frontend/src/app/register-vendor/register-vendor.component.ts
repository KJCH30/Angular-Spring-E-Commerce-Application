import { Component } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register-vendor',
  templateUrl: './register-vendor.component.html',
  styleUrl: './register-vendor.component.css'
})
export class RegisterVendorComponent {
  hide = true;

  constructor(private userService: UserService, private router: Router) {}

  clickEvent(event: Event): void {
    event.preventDefault();
    this.hide = !this.hide;
  }

  registerVendor(registerForm: NgForm) {
    if (registerForm.invalid) {
      return;
    }

    if (registerForm.value.userPassword !== registerForm.value.confirmPassword) {
      registerForm.controls['confirmPassword'].setErrors({ mustMatch: true });
      return;
    }

    this.userService.registerVendor(registerForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
