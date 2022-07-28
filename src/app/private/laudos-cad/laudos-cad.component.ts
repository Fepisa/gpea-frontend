import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LaudoService } from '../services/laudo.service';
import * as moment from 'moment';

@Component({
  selector: 'app-laudos-cad',
  templateUrl: './laudos-cad.component.html',
  styleUrls: ['./laudos-cad.component.css']
})
export class LaudosCadComponent implements OnInit {

  formulario!: FormGroup;

  id!: number;

  edicao: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, 
    private service: LaudoService) { }

  ngOnInit(): void {
    this.createForm();
    this.edicao = false;
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.service.getLaudoById(this.id).subscribe(result => {
        this.edicao = true;
        this.formulario.get('codigo')?.setValue(result.data.codigo);
        this.formulario.get('descricao')?.setValue(result.data.descricao);
        this.formulario.get('capacidade')?.setValue(result.data.capacidade);
        this.formulario.get('massa')?.setValue(result.data.massa);
        this.formulario.get('quantidade')?.setValue(result.data.quantidade);
        this.formulario.get('tipo')?.setValue(result.data.tipo);
        this.formulario.get('empresa')?.setValue(result.data.empresa);
        this.formulario.get('local_geral')?.setValue(result.data.local_geral);
        this.formulario.get('local_especifico')?.setValue(result.data.local_especifico);
        this.formulario.get('data')?.setValue(moment(result.data.data, "DD/MM/YYYY"));
        this.formulario.get('contrato')?.setValue(result.data.contrato);
        this.formulario.get('crea')?.setValue(result.data.crea);
        this.formulario.get('art')?.setValue(result.data.art);
        this.formulario.get('capacidade_2')?.setValue(result.data.capacidade_2);
        this.formulario.get('massa_2')?.setValue(result.data.massa_2);
        this.formulario.get('quantidade_2')?.setValue(result.data.quantidade_2);
        this.formulario.get('tipo_2')?.setValue(result.data.tipo_2);
        this.formulario.get('empresa_2')?.setValue(result.data.empresa_2);
        this.formulario.get('local_geral_2')?.setValue(result.data.local_geral_2);
        this.formulario.get('local_especifico_2')?.setValue(result.data.local_especifico_2);
        this.formulario.get('data_2')?.setValue(moment(result.data.data_2, "DD/MM/YYYY"));
        this.formulario.get('contrato_2')?.setValue(result.data.contrato_2);
        this.formulario.get('crea_2')?.setValue(result.data.crea_2);
        this.formulario.get('art_2')?.setValue(result.data.art_2);
      });
    }
  }

  createForm() {
    this.formulario = this.formBuilder.group({
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      capacidade: ['', Validators.required],
      massa: ['', Validators.required],
      quantidade: ['', Validators.required],
      tipo: ['', Validators.required],
      empresa: ['', Validators.required],
      local_geral: ['', Validators.required],
      local_especifico: ['', Validators.required],
      data: ['', Validators.required],
      contrato: ['', Validators.required],
      crea: ['', Validators.required],
      art: ['', Validators.required], 
      capacidade_2: [''],
      massa_2: [''],
      quantidade_2: [''],
      tipo_2: [''],
      empresa_2: [''],
      local_geral_2: [''],
      local_especifico_2: [''],
      data_2: [''],
      contrato_2: [''],
      crea_2: [''],
      art_2: ['']
    });
  }

  save() {
    let data = this.formulario.value;
    data.data = data.data ? moment(data.data).format("DD/MM/YYYY") : "";
    data.data_2 = data.data_2 ? moment(data.data_2).format("DD/MM/YYYY") : "";
    if (this.edicao) {
      this.service.updateLaudo(data, this.id).subscribe({
        next: (result: any) => {
          alert(result.message);
          this.router.navigate(['private', 'laudos']);
        },
        error: (err) => {
          console.log(err);
          alert('Ocorreu um erro ao atualizar o laudo!');
        }
      });  
    } else {
      this.service.saveLaudo(data).subscribe({
        next: (result: any) => {
          alert(result.message);
          this.router.navigate(['private', 'laudos']);
        },
        error: (err) => {
          console.log(err);
          alert('Ocorreu um erro ao registrar o laudo!');
        }
      });
    }
  }

  reset() {
    this.formulario.reset();
  }

  voltar() {
    this.router.navigate(['private', 'laudos']);
  }

}
