import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { LaudoService } from '../services/laudo.service';

@Component({
  selector: 'app-laudos-import',
  templateUrl: './laudos-import.component.html',
  styleUrls: ['./laudos-import.component.css']
})
export class LaudosImportComponent implements OnInit {

  selectedFiles!: FileList;
  currentFile!: File | null;
  progress = 0;
  message = '';
  userRoleAdmin: boolean = false;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  bufferValue = 75;

  @ViewChild("fileInput")
  fileInputElement!: ElementRef;

  constructor(private service: LaudoService, private router: Router) { }

  ngOnInit(): void {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let roles = auth.roles;
    this.userRoleAdmin = roles.find((element: any) => element === 'Admin');
    if (!this.userRoleAdmin) {
      this.voltar();
    }
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;
    this.currentFile = this.selectedFiles[0];
    this.service.upload(this.currentFile).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
        }
      },
      error: (err) => {
        console.log(err);
        this.progress = 0;
        this.message = 'Erro ao realizar o upload do arquivo. Entre em contato com suporte!';
        this.currentFile = null;
      }
    });

    this.fileInputElement.nativeElement.value = "";
  }

  voltar() {
    this.router.navigate(['private/laudos']);
  }

}
