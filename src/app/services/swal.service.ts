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
      confirmButtonColor: '#696cf8',
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

  async showConfirm(text: string) {
    const resutl = await Swal.fire({
      title: 'ยืนยันการดำเนินการ?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonColor: '#696cf8',
      cancelButtonColor: '#ec7063',
    });
    return resutl.isConfirmed;
  }

  showError(message: string) {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: message,
      icon: 'error',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#696cf8',
    });
  }

  showErrorDepartment(message: string) {
    Swal.fire({
      title: 'กรุณาเลือกเเผนก',
      text: message,
      icon: 'error',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#696cf8',
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
  showErrorCompany(message: string) {
    Swal.fire({
      title: 'กรุณาเลือกบริษัท',
      text: message,
      icon: 'warning',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#696cf8',
    });
  }
}
