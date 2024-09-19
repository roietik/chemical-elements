import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {NgForOf, NgIf} from '@angular/common';
import {PeriodicElementEditComponent} from '../periodic-element-edit/periodic-element-edit.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TableModalService} from '../../../services/table-modal/table-modal.service';
import {MatInputModule} from '@angular/material/input';
import {debounceTime, distinctUntilChanged, Observable} from 'rxjs';
import {SearchByPipe} from '../../../pipes/search.pipe';
import {rxState} from '@rx-angular/state';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

export const ELEMENTS_MOCKUP: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

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
    NgForOf,
  ],
  templateUrl: './periodic-elements-list.component.html'
})
export class PeriodicElementsListComponent implements OnInit  {
  readonly displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  private readonly state = rxState<{
    periodicElements: PeriodicElement[];
    search: string;
  }>(({ set }): void => {
    set({
      periodicElements: ELEMENTS_MOCKUP,
      search: ''
    });
  });
  periodicElements$ = this.state.select('periodicElements');
  filter$ = this.state.select('search')
    .pipe(
      debounceTime(2000),
      distinctUntilChanged()
    );

  constructor(
    private readonly tableModalService: TableModalService
  ) {
  }

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.periodicElements$
      .subscribe((response: PeriodicElement[]): void => {
        this.dataSource.data = response;
      });
  }

  changeFilter(event: Event): void {
    const element = event.target as HTMLInputElement,
      value = element.value.trim().toLocaleLowerCase();
    this.state.set({ search: value });
  }

  edit(element: PeriodicElement): void {
    this.openModal(element)
      .subscribe((dataSource):  void => {
        this.dataSource = dataSource;
      });
  }

  private openModal(element: PeriodicElement): Observable<MatTableDataSource<PeriodicElement>> {
    return this.tableModalService.openModal<PeriodicElementEditComponent, PeriodicElement>(
      element,
      this.dataSource.data,
      PeriodicElementEditComponent
    )
  }
}
