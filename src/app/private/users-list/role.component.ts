import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  formulario!: FormGroup;
  id!: number;
  userRoleAdmin: boolean = false;
  currentRole!: string;
  _ref: any;
  parentComponent: any;

  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.createForm();
    if (!this.userRoleAdmin) {
      this.formulario.get('role')?.disable();
      if (this.currentRole === 'Admin') {
        this.formulario.get('role')?.setValue("Administrador");
      } else {
        this.formulario.get('role')?.setValue("Leitor");
      }
    } else {
      this.formulario.get('role')?.enable();
      this.formulario.get('role')?.setValue(this.currentRole);
    }
  }

  createForm() {
    this.formulario = this.formBuilder.group({
      role: ['']
    });
  }

  updateRole() {
    let data = {
      id: this.id,
      old_role: this.currentRole,
      new_role: this.formulario.get('role')?.value
    }
    this.userService.updateRole(data).subscribe({
      next: (data: any) => {
        alert(data.message);
        this.parentComponent.loadData();
        this._ref.destroy();
      },
      error: (err) => {
        console.log(err);
        alert('Ocorreu um erro ao atualizar a permissão!');
      }
    });
  }

}