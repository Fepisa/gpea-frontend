import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  hide = true;
  loading = false;
  errorMessage = '';
  currentYear = new Date().getFullYear();

  constructor(private fb: FormBuilder, private as: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.as.userAuthenticated()) {
      this.router.navigate(['/']);
    } else {
      this.createForm();
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  doLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.as.doLogin(this.loginForm.value).subscribe({
      next: (data: any) => {
        const username = this.loginForm.get('email')?.value;
        let expireDate = new Date();
        expireDate.setSeconds(expireDate.getSeconds() + 86400);
        localStorage.setItem('gpea', JSON.stringify({
          username, 
          id: data.data.id,
          name: data.data.name,
          token: data.data.token, 
          empresa: data.data.empresa,
          local: data.data.local,
          roles: data.data.roles, 
          expires: expireDate
        }));
        this.router.navigate(['private']);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.errorMessage = 'Usuário e/ou senha inválidos!';
      }
    });
  }

  reset() {
    this.loginForm.reset();
  }

}
