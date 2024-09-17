import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-periodic-element-edit',
  standalone: true,
  imports: [
    MatTableModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInput
  ],
  templateUrl: './periodic-element-edit.component.html',
  styleUrl: './periodic-element-edit.component.scss'
})
export class PeriodicElementEditComponent implements OnInit {
  editForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PeriodicElementEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {element: any, column: string}) {}

  ngOnInit(): void {
    const { name, weight, symbol } = this.data.element;
    this.editForm = new FormGroup({
      name: new FormControl(name, [Validators.required]),
      weight: new FormControl(weight, [Validators.required]),
      symbol: new FormControl(symbol, [Validators.required])
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.editForm.invalid) {
      return
    }
    this.dialogRef.close({...this.data.element, ...this.editForm.value});
  }
}
