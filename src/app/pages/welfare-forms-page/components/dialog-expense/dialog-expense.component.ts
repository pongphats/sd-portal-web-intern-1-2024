import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-expense',
  templateUrl: './dialog-expense.component.html',
  styleUrls: ['./dialog-expense.component.scss']
})
export class DialogExpenseComponent implements OnInit {

  expenseForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogExpenseComponent>
  ) {
    this.expenseForm = this.fb.group({
      treatmentType: [''],
      startDate: [''],
      endDate: [''],
      daysCount: [''],
      medicalCost: [''],
      roomAndBoardCost: [''],
      details: [''],
      notes: ['']
    });
  }


  ngOnInit(): void {

    this.expenseForm.get('startDate')?.valueChanges.subscribe(() => {
      this.calculateDaysCount();
    });

    this.expenseForm.get('endDate')?.valueChanges.subscribe(() => {
      this.calculateDaysCount();
    });

  }

  onSave(): void {
    if (this.expenseForm.valid) {
      console.log('treatmentType >> ' + this.expenseForm.value.treatmentType)
      console.log('startDate >> ' + this.expenseForm.value.startDate)
      console.log('endDate >> ' + this.expenseForm.value.endDate)
      console.log('daysCount >> ' + this.expenseForm.value.daysCount)
      console.log('medicalCost >> ' + this.expenseForm.value.medicalCost)
      console.log('roomAndBoardCost >> ' + this.expenseForm.value.roomAndBoardCost)
      console.log('details >> ' + this.expenseForm.value.details)
      console.log('notes >> ' + this.expenseForm.value.notes)
      // this.dialogRef.close(this.expenseForm.value); // ส่งค่าของฟอร์มกลับไป
      this.onCancel()
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // ปิด Dialog โดยไม่ส่งค่า
  }

  calculateDaysCount(): void {
    const startDate = this.expenseForm.get('startDate')?.value;
    const endDate = this.expenseForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      this.expenseForm.patchValue({ daysCount: diffDays });
    } else {
      this.expenseForm.patchValue({ daysCount: '' });
    }
  }

  formatCurrency(event: any, controlName: string): void {
    let value = event.target.value;
    if (value) {
      // Remove any existing commas
      const cleanedValue = value.toString().replace(/,/g, '');
      // Convert to number and format
      const numberValue = parseFloat(cleanedValue);
      if (!isNaN(numberValue)) {
        const formattedValue = numberValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        this.expenseForm.patchValue({ [controlName]: formattedValue }, { emitEvent: false });
      }
    }
  }




}
