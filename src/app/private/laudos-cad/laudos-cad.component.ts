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

  colorObs = 'green';

  userRoleAdmin: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, 
    private service: LaudoService) { }

  ngOnInit(): void {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let roles = auth.roles;
    this.userRoleAdmin = roles.find((element: any) => element === 'Admin');
    this.createForm();
    this.edicao = false;
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.service.getLaudoById(this.id).subscribe(result => {
        if (!this.userRoleAdmin) {
          this.formulario.get('codigo')?.disable();
          this.formulario.get('descricao')?.disable();
          this.formulario.get('capacidade')?.disable();
          this.formulario.get('massa')?.disable();
          this.formulario.get('quantidade')?.disable();
          this.formulario.get('tipo')?.disable();
          this.formulario.get('local_geral')?.disable();
          this.formulario.get('local_especifico')?.disable();
          this.formulario.get('data')?.disable();
          this.formulario.get('validade')?.disable();
          this.formulario.get('relatorio')?.disable();
          this.formulario.get('responsavel_tecnico')?.disable();
          this.formulario.get('contratante')?.disable();
          this.formulario.get('contratada')?.disable();
        } else {
          this.edicao = true;
          this.formulario.get('codigo')?.enable();
          this.formulario.get('descricao')?.enable();
          this.formulario.get('capacidade')?.enable();
          this.formulario.get('massa')?.enable();
          this.formulario.get('quantidade')?.enable();
          this.formulario.get('tipo')?.enable();
          this.formulario.get('local_geral')?.enable();
          this.formulario.get('local_especifico')?.enable();
          this.formulario.get('data')?.enable();
          this.formulario.get('validade')?.enable();
          this.formulario.get('relatorio')?.enable();
          this.formulario.get('responsavel_tecnico')?.enable();
          this.formulario.get('contratante')?.enable();
          this.formulario.get('contratada')?.enable();
        }
        this.formulario.get('codigo')?.setValue(result.data.codigo);
        this.formulario.get('descricao')?.setValue(result.data.descricao);
        this.formulario.get('capacidade')?.setValue(result.data.capacidade);
        this.formulario.get('massa')?.setValue(result.data.massa);
        this.formulario.get('quantidade')?.setValue(result.data.quantidade);
        this.formulario.get('tipo')?.setValue(result.data.tipo);
        this.formulario.get('local_geral')?.setValue(result.data.local_geral);
        this.formulario.get('local_especifico')?.setValue(result.data.local_especifico);
        this.formulario.get('data')?.setValue(moment(result.data.data, "DD/MM/YYYY"));
        this.formulario.get('validade')?.setValue(moment(result.data.validade, "DD/MM/YYYY"));
        this.formulario.get('relatorio')?.setValue(result.data.relatorio);
        this.formulario.get('responsavel_tecnico')?.setValue(result.data.responsavel_tecnico);
        this.formulario.get('contratante')?.setValue(result.data.contratante);
        this.formulario.get('contratada')?.setValue(result.data.contratada);
        this.verificarValidade();
        this.atualizaObservacao();
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
      local_geral: ['', Validators.required],
      local_especifico: ['', Validators.required],
      data: ['', Validators.required],
      validade: ['', Validators.required],
      relatorio: ['', Validators.required],
      responsavel_tecnico: ['', Validators.required], 
      contratante: ['', Validators.required],
      contratada: ['', Validators.required],
      observacao: [{value: '', disabled: true}]
    });
  }

  verificarValidade() {
    let validade = this.formulario.get('validade')?.value;
    let dataAtual = moment().startOf('day');
    if (validade != null && validade !== '') {
      if (dataAtual.isAfter(validade)) {
        this.formulario.get('observacao')?.setValue('REPROVADO! LAUDO VENCIDO! NÃO UTILIZAR!');
        this.colorObs = 'red';
      } else {
        this.formulario.get('observacao')?.setValue('APROVADO! UTILIZAR APÓS INSPEÇÃO VISUAL!')
        this.colorObs = 'green';
      }
    }
  }

  atualizaObservacao() {
    let data = {
      id: this.id,
      observacao: this.formulario.get('observacao')?.value
    }
    this.service.updateObservacao(data).subscribe({
      next: (result: any) => {
        console.log('Observação do laudo ' + result.data.codigo + ' atualizado!');
      }
    });
  }

  save() {
    let data = this.formulario.getRawValue();
    data.data = data.data ? moment(data.data).format("DD/MM/YYYY") : "";
    data.validade = data.validade ? moment(data.validade).format("DD/MM/YYYY") : "";
    if (this.edicao) {
      this.service.updateLaudo(data, this.id).subscribe({
        next: (result: any) => {
          alert(result.message);
          this.router.navigate(['private', 'laudos']);
        },
        error: (err) => {
          console.log(err);
          alert('Ocorreu um erro ao atualizar o laudo! ' + err.error.message);
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
          alert('Ocorreu um erro ao registrar o laudo! ' + err.error.message);
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
