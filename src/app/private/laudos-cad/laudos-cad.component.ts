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

  podeEditar: boolean = true;

  userLocal: string = '';

  userEmpresa: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, 
    private service: LaudoService) { }

  ngOnInit(): void {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let roles = auth.roles;
    this.userRoleAdmin = !!roles.find((element: any) => element === 'Admin');
    this.userLocal = auth.local ?? '';
    this.userEmpresa = auth.empresa ?? '';
    this.createForm();
    this.edicao = false;
    this.podeEditar = true;
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.edicao = true;
      this.service.getLaudoById(this.id).subscribe(result => {
        if (this.userRoleAdmin) {
          // Admin: pode alterar qualquer dado do laudo
          this.podeEditar = true;
          this.habilitarCampos([]);
        } else if (this.mesmaUnidade(result.data.local_geral, this.userLocal)) {
          // Não admin da mesma unidade: não altera código, unidade e contratante
          this.podeEditar = true;
          this.habilitarCampos(['codigo', 'local_geral', 'contratante']);
        } else {
          // Não admin de outra unidade: somente leitura
          this.podeEditar = false;
          this.desabilitarCampos();
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
    } else if (!this.userRoleAdmin) {
      // Não admin criando laudo: unidade e contratante fixados conforme o usuário
      this.fixarCamposUsuario();
    }
  }

  private camposEditaveis(): string[] {
    return Object.keys(this.formulario.controls).filter(campo => campo !== 'observacao');
  }

  private habilitarCampos(bloqueados: string[]) {
    this.camposEditaveis().forEach(campo => {
      if (bloqueados.includes(campo)) {
        this.formulario.get(campo)?.disable();
      } else {
        this.formulario.get(campo)?.enable();
      }
    });
  }

  private desabilitarCampos() {
    this.camposEditaveis().forEach(campo => this.formulario.get(campo)?.disable());
  }

  private fixarCamposUsuario() {
    this.formulario.get('local_geral')?.setValue(this.userLocal);
    this.formulario.get('local_geral')?.disable();
    this.formulario.get('contratante')?.setValue(this.userEmpresa);
    this.formulario.get('contratante')?.disable();
  }

  private mesmaUnidade(a: any, b: any): boolean {
    return String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();
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
    const bloqueados: { [campo: string]: any } = {};
    ['codigo', 'local_geral', 'contratante'].forEach(campo => {
      const control = this.formulario.get(campo);
      if (control?.disabled) {
        bloqueados[campo] = control.value;
      }
    });
    this.formulario.reset();
    // Mantém os valores dos campos que o usuário não pode alterar
    Object.keys(bloqueados).forEach(campo => this.formulario.get(campo)?.setValue(bloqueados[campo]));
  }

  voltar() {
    this.router.navigate(['private', 'laudos']);
  }

}
