import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LaudoService } from '../services/laudo.service';
import { UserService } from '../services/user.service';
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

  userId: number | null = null;

  userLocal: string = '';

  userEmpresa: string = '';

  usuarios: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, 
    private service: LaudoService, private userService: UserService) { }

  ngOnInit(): void {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let roles = auth.roles;
    this.userRoleAdmin = !!roles.find((element: any) => element === 'Admin');
    this.userId = auth.id ?? null;
    this.userLocal = auth.local ?? '';
    this.userEmpresa = auth.empresa ?? '';
    this.createForm();
    this.carregarUsuarios();
    this.edicao = false;
    this.podeEditar = true;
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.edicao = true;
      this.service.getLaudoById(this.id).subscribe(result => {
        // Permissão calculada no backend: Admin ou usuário responsável pelo laudo
        this.podeEditar = !!result.data.pode_editar;
        if (!this.podeEditar) {
          // Não é Admin nem responsável: somente leitura
          this.desabilitarCampos();
        } else if (this.userRoleAdmin) {
          // Admin: pode alterar qualquer dado do laudo, inclusive o responsável
          this.habilitarCampos([]);
        } else {
          // Responsável (não admin): não altera código nem responsável
          this.habilitarCampos(['codigo', 'responsavel_id']);
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
        this.formulario.get('responsavel_id')?.setValue(result.data.responsavel_id);
        this.verificarValidade();
        // Só grava a observação quando o usuário pode alterar o laudo
        if (this.podeEditar) {
          this.atualizaObservacao();
        }
      });
    } else {
      // Criação: responsável pré-selecionado com o usuário logado; só o Admin pode escolher outro
      this.selecionarUsuarioLogado();
      this.preencherLocalEmpresa();
      if (!this.userRoleAdmin) {
        this.formulario.get('responsavel_id')?.disable();
      }
    }
  }

  private carregarUsuarios() {
    this.userService.getUserOptions().subscribe({
      next: (result: any) => this.usuarios = result.data ?? [],
      error: (err) => console.log(err)
    });
  }

  private selecionarUsuarioLogado() {
    if (this.userId) {
      this.formulario.get('responsavel_id')?.setValue(this.userId);
      return;
    }
    // Sessões antigas não guardam o id do usuário: busca o usuário logado
    this.userService.getCurrentUser().subscribe(result => {
      this.userId = result.data.id;
      this.formulario.get('responsavel_id')?.setValue(this.userId);
    });
  }

  // Pré-preenche unidade (local geral) e contratante com os dados do usuário logado; continuam editáveis
  private preencherLocalEmpresa() {
    if (this.userLocal || this.userEmpresa) {
      this.aplicarLocalEmpresa(this.userLocal, this.userEmpresa);
      return;
    }
    // Sessões antigas podem não ter local/empresa: busca o usuário logado
    this.userService.getCurrentUser().subscribe(result => {
      this.userLocal = result.data.local ?? '';
      this.userEmpresa = result.data.empresa ?? '';
      this.aplicarLocalEmpresa(this.userLocal, this.userEmpresa);
    });
  }

  private aplicarLocalEmpresa(local: string, empresa: string) {
    // Não sobrescreve o que o usuário já tiver digitado
    const localGeral = this.formulario.get('local_geral');
    const contratante = this.formulario.get('contratante');
    if (localGeral && !localGeral.value) {
      localGeral.setValue(local);
    }
    if (contratante && !contratante.value) {
      contratante.setValue(empresa);
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
      responsavel_id: [null],
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
    ['codigo', 'responsavel_id'].forEach(campo => {
      const control = this.formulario.get(campo);
      if (control?.disabled) {
        bloqueados[campo] = control.value;
      }
    });
    this.formulario.reset();
    // Mantém os valores dos campos que o usuário não pode alterar
    Object.keys(bloqueados).forEach(campo => this.formulario.get(campo)?.setValue(bloqueados[campo]));
    if (!this.edicao) {
      this.selecionarUsuarioLogado();
      this.preencherLocalEmpresa();
    }
  }

  voltar() {
    this.router.navigate(['private', 'laudos']);
  }

}
