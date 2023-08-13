import { Component, Input, OnInit, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RoleComponent } from './role.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  entryComponents: [RoleComponent]
})
export class UsersListComponent implements OnInit {

  contentLoaded = false;
  displayedColumns: string[] = ['visualiza', 'name', 'email', 'empresa', 'local', 'acoes'];
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

  constructor(private router: Router, private service: UserService) {
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
    this.userRoleAdmin = auth.roles.find((element: any) => element === 'Admin');
    if (this.userRoleAdmin) {
      this.service.getUsers().subscribe(result => {
        this.dataSource = new MatTableDataSource<any>(result.data);
        this.contentLoaded = true;
        this.isPagination = true;
        this.expandedRow = -1;
      });
    } else {
      this.service.getCurrentUser().subscribe(result => {
        let data = [result.data];
        this.dataSource = new MatTableDataSource<any>(data);
        this.contentLoaded = true;
        this.isPagination = true;
        this.expandedRow = -1;
      });
    }
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

  expandRow(index: number, row: any) {
    if (this.expandedRow != -1) {
      this.containers.toArray()[this.expandedRow].clear();
    }

    if (this.expandedRow === index) {
      this.expandedRow = -1;
    } else {
      const container = this.containers.toArray()[index];
      const roleComponent = container.createComponent(RoleComponent);
      roleComponent.instance.id = row.id;
      roleComponent.instance.userRoleAdmin = this.userRoleAdmin;
      roleComponent.instance.currentRole = row.roles[0].name;
      roleComponent.instance._ref = roleComponent;
      roleComponent.instance.parentComponent = this;
      this.expandedRow = index;
    }
  }

}
