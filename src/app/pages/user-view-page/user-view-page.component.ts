import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/interface/employee';
import { ChangePasswordReq } from 'src/app/interface/request';
import { ApiResponse } from 'src/app/interface/response';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-user-view-page',
  templateUrl: './user-view-page.component.html',
  styleUrls: ['./user-view-page.component.scss'],
})
export class UserViewPageComponent implements OnInit {
  userDetail: Employee = {} as Employee;
  role: string = '';
  newHide: boolean = true;
  oldHide: boolean = true;
  passWordChangeHide: boolean = true;
  sectorAndDept = '';
  passwordChgForms!: FormGroup<any>;
  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private authService: AuthService,
    private fb: FormBuilder,
    private swalService: SwalService
  ) {
    this.passwordChgForms = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initailUser();
  }

  async initailUser() {
    try {
      const uid = this.authService.getUID();
      const user =
        (await this.apiService.findUserById(uid).toPromise()) ||
        ({} as Employee);
      this.role = this.commonService.translateRole(user.roles);
      this.userDetail = user;
      this.sectorAndDept = `${user.sector.sectorName}/${user.department.deptName}`;
    } catch (error) {
      console.error(error);
    }
  }

  async changePassword() {
    this.swalService.showLoading();
    try {
      const req: ChangePasswordReq = {
        oldPassword: this.passwordChgForms.get('oldPassword')?.value,
        newPassword: this.passwordChgForms.get('newPassword')?.value,
        confirmPassword: this.passwordChgForms.get('newPassword')?.value,
      };
      const uid = this.authService.getUID();
      const res =
        (await this.apiService.changePassword(req, uid).toPromise()) ||
        ({} as ApiResponse<any>);
      this.swalService.showSuccess(res.responseMessage);
    } catch (error) {
      console.error(error);
      this.swalService.showError(
        'ไม่สามารถเปลี่ยนรหัสผ่านได้โปรดตรวจสอบความถูกต้องของรหัสผ่านเดิม'
      );
    }
  }
}
