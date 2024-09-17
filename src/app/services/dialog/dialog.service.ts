import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ComponentType} from '@angular/cdk/portal';
import {MatTableDataSource} from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class DialogService  {
  constructor(
    public readonly dialog: MatDialog
  ) {
  }
  openDialog<TComponent, TElement>(
    element: TElement,
    elements: TElement[],
    component: ComponentType<TComponent>
  ): Observable<MatTableDataSource<TElement>> {
    const config: MatDialogConfig = {data: { element }},
       dialogRef = this.dialog.open(component, config);

    return dialogRef.afterClosed()
      .pipe(
        map((response) => {
          const updatedDataSource = new MatTableDataSource<TElement>([...elements]),
            index = updatedDataSource.data.findIndex((el) => el === element);

          updatedDataSource.data[index] = response;
          return updatedDataSource;
        })
      );
  }
}