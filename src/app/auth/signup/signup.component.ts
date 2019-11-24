import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading = false;

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.creatUser(form.value.email, form.value.password);
  }

  constructor(public authService: AuthService) {}
}
