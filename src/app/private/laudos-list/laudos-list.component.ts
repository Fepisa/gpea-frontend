import { Component, Input, OnInit, Output, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DetalheComponent } from './detalhe.component';
import { ImageService } from '../services/image.service';
import { LaudoService } from '../services/laudo.service';

@Component({
  selector: 'app-laudos-list',
  templateUrl: './laudos-list.component.html',
  styleUrls: ['./laudos-list.component.css'],
  entryComponents: [DetalheComponent]
})
export class LaudosListComponent implements OnInit {

  contentLoaded = false;
  displayedColumns: string[] = ['visualiza', 'codigo', 'descricao', 'data', 'acoes'];
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

  constructor(private router: Router, private service: LaudoService, private imageService: ImageService) {
    this.contentLoaded = false;
    this.isPagination = false;
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
    this.userRoleAdmin = roles.find((element: any) => element === 'Admin');
    if (this.userRoleAdmin) {
      this.service.getLaudos().subscribe(result => {
        this.dataSource = new MatTableDataSource<any>(result.data);
        this.contentLoaded = true;
        this.isPagination = true;
        this.expandedRow = -1;
      });
    } else {
      this.service.getLaudoByLocalGeralAndContratante(auth.local, auth.empresa).subscribe(result => {
        this.dataSource = new MatTableDataSource<any>(result.data);
        this.contentLoaded = true;
        this.isPagination = true;
        this.expandedRow = -1;
      });
    }
  }

  onFileSelected(codigo: any, event: any) {
    const file:File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("codigo", codigo);
      formData.append("image", file);
      this.imageService.saveImage(formData).subscribe({
        next: (result: any) => {
          alert(result.message);
          this.loadData();
        },
        error: (err) => {
          console.log(err);
          alert('Ocorreu um erro ao realizar o upload da imagem!');
        }
      });
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