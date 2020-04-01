import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-reservation',
  templateUrl: './cancel-reservation.component.html',
  styleUrls: ['./cancel-reservation.component.css']
})
export class CancelReservationComponent {
  constructor(
    // DATA CONTAINS TENNANT NAME AND DATE STRING TO DISPLAY
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<CancelReservationComponent>
  ) {}

  cancelDialog() {
    this.dialogRef.close();
  }
}
