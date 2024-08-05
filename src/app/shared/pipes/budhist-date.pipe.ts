import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buddhistDate'
})
export class BuddhistDatePipe implements PipeTransform {

  transform(value: Date | string | number, format: string = 'DD/MM/yyyy'): string {
    if (!value) return '';
    const date = new Date(value);
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-based
    let year = date.getFullYear() + 543; // Convert to Buddhist year

    // Format the date
    let formattedDate = format
      .replace('DD', day.toString().padStart(2, '0'))
      .replace('MM', month.toString().padStart(2, '0'))
      .replace('yyyy', year.toString());

    return formattedDate;
  }
}
