import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {PeriodicElement, PeriodicElementsService} from '../../../services/periodic-elements/periodic-elements.service';
import {NgIf} from '@angular/common';
import {PeriodicElementEditComponent} from '../periodic-element-edit/periodic-element-edit.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DialogService} from '../../../services/dialog/dialog.service';
import {MatInputModule} from '@angular/material/input';
import {debounceTime, distinctUntilChanged, Observable} from 'rxjs';
import {SearchByPipe} from '../../../pipes/search.pipe';
import {TableService} from '../../../services/table/table.service';

@Component({
  selector: 'periodic-elements-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    NgIf,
    SearchByPipe,
  ],
  templateUrl: './periodic-elements-list.component.html'
})
export class PeriodicElementsListComponent implements OnInit  {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  filter$!: Observable<string>;


  constructor(
    private readonly periodicElementsService: PeriodicElementsService,
    private readonly dialogService: DialogService,
    private readonly tableService: TableService
  ) {
  }

  ngOnInit(): void {
    this.getPeriodicElements();
    this.getFilter();
  }

  private getPeriodicElements(): void {
    this.periodicElementsService.getPeriodicElements()
      .subscribe((response: PeriodicElement[]): void => {
        this.dataSource.data = response;
      });
  }

  private getFilter(): void {
    this.filter$ = this.tableService.filter$
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      );
  }

  doFilter(event: Event): void {
    this.tableService.doFilter(event);
  }

  editPeriodicElement(element: PeriodicElement): void {
    this.dialogService.openDialog<PeriodicElementEditComponent, PeriodicElement>(
      element,
      this.dataSource.data,
      PeriodicElementEditComponent
    )
      .subscribe((dataSource):  void => {
        this.periodicElementsService.setPeriodicElements(dataSource.data)
        this.dataSource = dataSource;
      });
  }
}
