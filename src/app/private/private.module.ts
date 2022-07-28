import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { getPtPaginatorIntl } from './pt-paginator-intl';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { PrivateRoutingModule } from './private-routing.module';
import { LaudosListComponent } from './laudos-list/laudos-list.component';
import { LaudosCadComponent } from './laudos-cad/laudos-cad.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersCadComponent } from './users-cad/users-cad.component';
import { DetalheComponent } from './laudos-list/detalhe.component';

@NgModule({
  declarations: [
    LaudosListComponent,
    LaudosCadComponent,
    UsersListComponent,
    UsersCadComponent,
    DetalheComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    NgxSkeletonLoaderModule.forRoot(),
    PrivateRoutingModule,
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    { provide: MatPaginatorIntl, useValue: getPtPaginatorIntl() }
  ]
})
export class PrivateModule { }
