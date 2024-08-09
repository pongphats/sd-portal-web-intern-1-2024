import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  showSuccess(message: string) {
    Swal.fire({
      text: message,
      icon: 'success',
      confirmButtonText: 'ตกลง',
    });
  }

  showLoading() {
    Swal.fire({
      title: 'Now loading',
      text: 'กำลังดำเนินการโปรดรอซักครู่',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  async showConfirm() {
    const resutl = await Swal.fire({
      title: 'ยืนยันการดำเนินการ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
    return resutl.isConfirmed;
  }

  showError(message: string) {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: message,
      icon: 'error',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: 'blue',
    });
  }

  showErrorDepartment(message: string) {
    Swal.fire({
      title: 'กรุณาเลือกเเผนก',
      text: message,
      icon: 'error',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: 'blue',
    });
  }

  showWarning(message: string) {
    Swal.fire({
      text: message,
      icon: 'warning',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: 'orange',
    });
  }
}
