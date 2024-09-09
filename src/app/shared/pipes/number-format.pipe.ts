import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
@Injectable({
  providedIn: 'root',
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value == null || value === '') return '';

    // แปลงค่าเป็นตัวเลข
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;

    // แยกค่าทศนิยม
    const [integerPart, decimalPart] = numberValue.toString().split('.');

    // เพิ่ม , คั่นหลัก
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // ถ้ามีค่าทศนิยม ให้แสดงให้ครบ
    if (decimalPart) {
      return `${formattedInteger}.${decimalPart}`;
    }

    // ถ้าไม่มีค่าทศนิยม ให้เติม .00
    return `${formattedInteger}.00`;
  }
}
