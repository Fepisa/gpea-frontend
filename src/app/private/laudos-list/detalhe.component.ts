import { Component } from '@angular/core';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.component.html',
  styles: [`
    :host {
      display: block;
      padding: 5px 10px 5px 10px;
      background: rgba(0,0,0,0.1);
      font-size: 14px
    }
  `]
})
export class DetalheComponent {
  
  displayedColumnsDetalhe: string[] = ['image', 'acoes'];
  dataSourceDetalhe: any = [];
  _ref: any;
  parentComponent: any;

  constructor(private imageService: ImageService) { }

  deleteImagem(id: any) {
    this.imageService.deleteImage(id).subscribe({
      next: (data: any) => {
        alert(data.message);
        this.parentComponent.loadData();
        this._ref.destroy();
      },
      error: (err) => {
        console.log(err);
        alert('Ocorreu um erro ao excluir a imagem!');
      }
    });
  }

}