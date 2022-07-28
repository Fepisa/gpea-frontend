import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users-cad',
  templateUrl: './users-cad.component.html',
  styleUrls: ['./users-cad.component.css']
})
export class UsersCadComponent implements OnInit {

  formulario!: FormGroup;

  hide = true;

  hide_c = true;

  id!: number;

  edicao: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, 
    private service: UserService) { }

  ngOnInit(): void {
    this.createForm();
    this.edicao = false;
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.service.getUserById(this.id).subscribe(result => {
        this.edicao = true;
        this.formulario.get('name')?.setValue(result.data.name);
        this.formulario.get('email')?.setValue(result.data.email);
      });
    } else {
      this.formulario.get('password')?.setValidators([Validators.required])
      this.formulario.get('password')?.updateValueAndValidity();
      this.formulario.get('c_password')?.setValidators([Validators.required])
      this.formulario.get('c_password')?.updateValueAndValidity();
    }
  }

  createForm() {
    this.formulario = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: [''],
      c_password: ['']
    });
  }

  save() {
    if (this.edicao) {
      this.service.updateUser(this.formulario.value, this.id).subscribe({
        next: (data: any) => {
          alert(data.message);
          this.router.navigate(['private', 'users']);
        },
        error: (err) => {
          console.log(err);
          alert('Ocorreu um erro ao atualizar o usuário!');
        }
      });  
    } else {
      this.service.saveUser(this.formulario.value).subscribe({
        next: (data: any) => {
          alert(data.message);
          this.router.navigate(['private', 'users']);
        },
        error: (err) => {
          console.log(err);
          alert('Ocorreu um erro ao registrar o usuário!');
        }
      });
    }
  }

  reset() {
    this.formulario.reset();
  }

  voltar() {
    this.router.navigate(['private', 'users']);
  }

}
