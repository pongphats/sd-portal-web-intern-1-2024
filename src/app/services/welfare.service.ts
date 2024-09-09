import { Injectable } from '@angular/core';
import { ExpenseReq } from '../interface/request';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WelfareService {
  constructor() {}

  private _pdfBase64!: string;
  private _xlsxBase64!: string;
  private _expenseId!: number;

  get expenseId(): number {
    return this._expenseId;
  }

  set expenseId(expenseId: number) {
    this._expenseId = expenseId;
  }

  get pdfBase64(): string {
    return this._pdfBase64;
  }

  set pdfBase64(value: string) {
    this._pdfBase64 = value;
  }

  get xlsxBase64(): string {
    return this._xlsxBase64;
  }

  set xlsxBase64(value: string) {
    this._xlsxBase64 = value;
  }
}
