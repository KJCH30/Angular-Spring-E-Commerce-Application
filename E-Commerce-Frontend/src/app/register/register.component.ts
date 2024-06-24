import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private userService: UserService,
    private router: Router
  ){

  }

  hide = true;

  clickEvent(event: Event): void {
    event.preventDefault(); 
    event.stopPropagation(); 
    this.hide = !this.hide;
  }

  register(registerForm : NgForm){
    console.log(registerForm.value)
    this.userService.register(registerForm.value).subscribe({
      next: 
      (response) =>{
        this.router.navigate(['/login'])
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
