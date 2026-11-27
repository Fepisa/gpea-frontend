import { Component, Input, OnInit, Output, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DetalheComponent } from './detalhe.component';
import { ImageService } from '../services/image.service';
import { LaudoService } from '../services/laudo.service';
import * as moment from 'moment';

@Component({
  selector: 'app-laudos-list',
  templateUrl: './laudos-list.component.html',
  styleUrls: ['./laudos-list.component.css'],
  entryComponents: [DetalheComponent]
})
export class LaudosListComponent implements OnInit {

  contentLoaded = false;
  displayedColumns: string[] = ['visualiza', 'codigo', 'descricao', 'unidade', 'local', 'data', 'acoes'];
  expandedRow!: number;
  userRoleAdmin: boolean = false;


  dataSource: any = [];
  @Input('isPagination') isPagination!: boolean;
  @ViewChild('paginator', {static: false}) set paginator(paginator: MatPaginator) {
    if (this.isPagination) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChildren('matrow', { read: ViewContainerRef }) containers: any;

  filtro: FormGroup;

  constructor(private router: Router, private service: LaudoService, private imageService: ImageService,
    private formBuilder: FormBuilder) {
    this.contentLoaded = false;
    this.isPagination = false;
    this.filtro = this.formBuilder.group({
      codigo: [''],
      local: [''],
      unidade: [''],
      dataInicio: [null],
      dataFim: [null]
    });
    this.filtro.valueChanges.subscribe(() => this.aplicarFiltro());
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.contentLoaded = false;
    this.isPagination = false;
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let roles = auth.roles;
    this.userRoleAdmin = !!roles.find((element: any) => element === 'Admin');
    // Todos os usuários leem todos os laudos; a alteração é controlada por podeEditar()
    this.service.getLaudos().subscribe(result => {
      this.dataSource = this.criarDataSource(result.data);
      this.contentLoaded = true;
      this.isPagination = true;
      this.expandedRow = -1;
    });
  }

  criarDataSource(data: any[]): MatTableDataSource<any> {
    const dataSource = new MatTableDataSource<any>(data);
    dataSource.filterPredicate = (element: any, filter: string) => this.filtrarLaudo(element, JSON.parse(filter));
    dataSource.filter = this.valorFiltro();
    return dataSource;
  }

  valorFiltro(): string {
    const { codigo, local, unidade, dataInicio, dataFim } = this.filtro.value;
    return JSON.stringify({
      codigo: (codigo || '').trim().toLowerCase(),
      local: (local || '').trim().toLowerCase(),
      unidade: (unidade || '').trim().toLowerCase(),
      dataInicio: dataInicio ? moment(dataInicio).format('YYYY-MM-DD') : null,
      dataFim: dataFim ? moment(dataFim).format('YYYY-MM-DD') : null
    });
  }

  filtrarLaudo(element: any, filtro: any): boolean {
    if (filtro.codigo && !String(element.codigo ?? '').toLowerCase().includes(filtro.codigo)) {
      return false;
    }
    if (filtro.local && !String(element.local_especifico ?? '').toLowerCase().includes(filtro.local)) {
      return false;
    }
    if (filtro.unidade && !String(element.local_geral ?? '').toLowerCase().includes(filtro.unidade)) {
      return false;
    }
    if (filtro.dataInicio || filtro.dataFim) {
      const data = moment(element.data, 'DD/MM/YYYY', true);
      if (!data.isValid()) {
        return false;
      }
      if (filtro.dataInicio && data.isBefore(moment(filtro.dataInicio, 'YYYY-MM-DD'), 'day')) {
        return false;
      }
      if (filtro.dataFim && data.isAfter(moment(filtro.dataFim, 'YYYY-MM-DD'), 'day')) {
        return false;
      }
    }
    return true;
  }

  aplicarFiltro(): void {
    if (!(this.dataSource instanceof MatTableDataSource)) {
      return;
    }
    this.fecharDetalhe();
    this.dataSource.filter = this.valorFiltro();
    this.dataSource.paginator?.firstPage();
  }

  limparFiltro(): void {
    this.filtro.reset({ codigo: '', local: '', unidade: '', dataInicio: null, dataFim: null });
  }

  fecharDetalhe(): void {
    if (this.expandedRow != null && this.expandedRow !== -1) {
      this.containers.toArray()[this.expandedRow]?.clear();
      this.expandedRow = -1;
    }
  }

  importarLaudo(): void {
    this.router.navigate(['private', 'laudos', 'import']);
  }

  exportarLaudo(): void {
    this.service.download().subscribe(data => this.service.downloadFile(data)),
      (error: any) => {
        console.log(error);
        alert('Erro ao realizar o download do arquivo!');
      }, 
      () => {
        alert('Download realizado com sucesso!');
      }
  }

  novoLaudo(): void {
    this.router.navigate(['private', 'laudo']);
  }

  podeEditar(element: any): boolean {
    // Permissão calculada no backend: Admin ou usuário responsável pelo laudo
    return !!element?.pode_editar;
  }


  editarLaudo(id: any): void {
    this.router.navigate(['private', 'laudo', id]);    
  }

  deleteLaudo(id: any): void {
    this.service.deleteLaudo(id).subscribe({
      next: (data: any) => {
        alert(data.message);
        this.loadData();
      },
      error: (err) => {
        console.log(err);
        alert('Ocorreu um erro ao excluir o laudo!');
      }
    });
  }

  usuarios() {
    this.router.navigate(['private', 'users']);
  }

  logout() {
    localStorage.removeItem('gpea');
    this.router.navigate(['/login']);
  }

  expandRow(index: number, row: any) {
    if (this.expandedRow != -1) {
      this.containers.toArray()[this.expandedRow].clear();
    }

    if (this.expandedRow === index) {
      this.expandedRow = -1;
    } else {
      const container = this.containers.toArray()[index];
      const detalheComponent = container.createComponent(DetalheComponent);

      this.imageService.getImageByCodigo(row.codigo).subscribe(result => {
        detalheComponent.instance.dataSourceDetalhe = new MatTableDataSource<any>(result.data);
        detalheComponent.instance._ref = detalheComponent;
        detalheComponent.instance.parentComponent = this;
        this.expandedRow = index;
      });
    }
  }

}