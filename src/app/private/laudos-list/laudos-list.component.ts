import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LaudoService } from '../services/laudo.service';

@Component({
  selector: 'app-laudos-list',
  templateUrl: './laudos-list.component.html',
  styleUrls: ['./laudos-list.component.css']
})
export class LaudosListComponent implements OnInit {

  contentLoaded = false;
  displayedColumns: string[] = ['codigo', 'descricao', 'data', 'acoes'];

  dataSource: any = [];
  @Input('isPagination') isPagination!: boolean;
  @ViewChild('paginatorInaptos', {static: false}) set paginatorInaptos(paginatorInaptos: MatPaginator) {
    if (this.isPagination) {
      this.dataSource.paginator = paginatorInaptos;
    }
  }

  constructor(private route: ActivatedRoute, private router: Router, private service: LaudoService) {
    this.contentLoaded = false;
    this.isPagination = false;
  }

  ngOnInit(): void {
    this.contentLoaded = false;
    this.service.getLaudos().subscribe(result => {
      this.dataSource = new MatTableDataSource<any>(result.data);
      this.contentLoaded = true;
      this.isPagination = true;
    });
  }

}
