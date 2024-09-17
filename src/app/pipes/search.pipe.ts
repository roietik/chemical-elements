import { Pipe, PipeTransform } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  standalone: true,
  name: 'searchBy'
})
export class SearchByPipe<TData extends Object> implements PipeTransform {
  transform(value: MatTableDataSource<TData>, filter$: Observable<string>): Observable<TData[]> {
    return filter$
      .pipe(
        map((filterValue) => this.applyFilter(value.data, filterValue))
      );
  }

  private applyFilter(data: TData[], filterValue: string): TData[] {
    if (!filterValue) {
      return data;
    }
    return data.filter((item) => this.filterItem(item, filterValue.toLowerCase()));
  }

  private filterItem(item: TData, filterValue: string): boolean {
    return Object.values(item)
      .some((value) => value.toString().toLowerCase().includes(filterValue));
  }
}