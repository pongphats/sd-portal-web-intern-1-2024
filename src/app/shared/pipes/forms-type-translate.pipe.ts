import { Injectable, Pipe, PipeTransform } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
@Pipe({
  name: 'formsTypeTranslate'
})
export class FormsTypeTranslatePipe implements PipeTransform {

  private typeMap: { [key: string]: string } = {
    'training': 'ฝึกอบรม/สัมมนา',
    'getCertificate': 'สอบ Certificate',
  };

  transform(key: string): string {
    return this.typeMap[key] || key; // ถ้าไม่พบคำแปล จะคืนค่า role เดิม
  }

}
