import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resultTranslate',
})
export class ResultTranslatePipe implements PipeTransform {
  private resultMap: { [key: string]: string } = {
    pass: 'ผ่าน',
    fail: 'ไม่ผ่าน',
    noResult: 'ไม่ ประเมินผล',
  };

  transform(value: string): string {
    return this.resultMap[value];
  }
}
