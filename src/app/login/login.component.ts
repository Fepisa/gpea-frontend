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
    this.as.doLogin(this.loginForm.value).subscribe({
      next: (data: any) => {
        const username = this.loginForm.get('email')?.value;
        let expireDate = new Date();
        expireDate.setSeconds(expireDate.getSeconds() + 86400);
        localStorage.setItem('gpea', JSON.stringify({username, token: data.data.token, expires: expireDate}));
        this.router.navigate(['private']);
      },
      error: (err) => {
        console.log(err);
        alert('Usuário e/ou senha inválidos!');
      }
    });
  }

  reset() {
    this.loginForm.reset();
  }

}
