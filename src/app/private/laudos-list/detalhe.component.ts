import { Component } from '@angular/core';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
      padding: 16px 24px 20px 72px;
      box-sizing: border-box;
      background: #fafafa;
      border-bottom: 1px solid #eee;
    }

    .detalhe-titulo {
      margin-bottom: 12px;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      color: #6b7280;
    }

    .galeria {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .galeria-item {
      position: relative;
      width: 180px;
      height: 180px;
      border-radius: 10px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.35);
    }

    .galeria-item img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.2s ease;
    }

    .galeria-item:hover img {
      transform: scale(1.04);
    }

    .galeria-excluir {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 255, 255, 0.92) !important;
      color: #c62828 !important;
    }

    .sem-imagens {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #9ca3af;
      font-size: 0.9rem;
    }

    @media (max-width: 600px) {
      :host {
        padding: 16px;
      }

      .galeria-item {
        width: calc(50% - 8px);
        height: 140px;
      }
    }
  `]
})
export class DetalheComponent {
  
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