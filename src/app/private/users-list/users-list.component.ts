import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  contentLoaded = false;
  displayedColumns: string[] = ['name', 'email', 'acoes'];

  dataSource: any = [];
  @Input('isPagination') isPagination!: boolean;
  @ViewChild('paginator', {static: false}) set paginator(paginator: MatPaginator) {
    if (this.isPagination) {
      this.dataSource.paginator = paginator;
    }
  }

  constructor(private router: Router, private service: UserService) {
    this.contentLoaded = false;
    this.isPagination = false;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.contentLoaded = false;
    this.service.getUsers().subscribe(result => {
      this.dataSource = new MatTableDataSource<any>(result.data);
      this.contentLoaded = true;
      this.isPagination = true;
    });
  }

  novoUser(): void {
    this.router.navigate(['private', 'user']);
  }

  editarUser(id: any): void {
    this.router.navigate(['private', 'user', id]);    
  }

  laudos() {
    this.router.navigate(['private', 'laudos']);
  }

  logout() {
    localStorage.removeItem('gpea');
    this.router.navigate(['/login']);
  }

}
