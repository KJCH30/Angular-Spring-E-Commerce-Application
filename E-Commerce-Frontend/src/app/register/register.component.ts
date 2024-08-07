import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  hide = true;

  constructor(private userService: UserService, private router: Router) {}

  clickEvent(event: Event): void {
    event.preventDefault();
    this.hide = !this.hide;
  }

  register(registerForm: NgForm) {
    if (registerForm.invalid) {
      return;
    }

    if (registerForm.value.userPassword !== registerForm.value.confirmPassword) {
      registerForm.controls['confirmPassword'].setErrors({ mustMatch: true });
      return;
    }

    this.userService.register(registerForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
