import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-make-reservation',
  templateUrl: './make-reservation.component.html',
  styleUrls: ['./make-reservation.component.css']
})
export class MakeReservationComponent {
  constructor(
    // DATA CONTAINS DATE STRING TO DISPLAY
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<MakeReservationComponent>
  ) {}

  public tennantName = '';

  cancelDialog() {
    this.dialogRef.close();
  }
}
