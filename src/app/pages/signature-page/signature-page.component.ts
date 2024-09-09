import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Employee } from 'src/app/interface/employee';
import { ApiResponse, MngDeptListRes } from 'src/app/interface/response';

import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-signature-page',
  templateUrl: './signature-page.component.html',
  styleUrls: ['./signature-page.component.scss'],
})
export class SignaturePageComponent implements OnInit {
  signaturePage!: FormGroup;
  employees: { id: number; fullName: string }[] = [];
  errorMessage: string | null = null;
  signatureImageUrl: SafeUrl | null = null;
  uploadedImageUrl: string | ArrayBuffer | null = null;
  selectedEmployeeId: number | null = null; // Keep track of selected employee ID
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {
    this.signaturePage = this.fb.group({
      id: [''],
      fullName: ['', Validators.required],
    });
  }
  get fullNameControl(): FormControl {
    return this.signaturePage.get('fullName') as FormControl;
  }

  ngOnInit(): void {
    this.getEmployee();
  }

  protected getEmployee() {
    this.apiService
      .getAllPrivilegeApprovers()
      .subscribe(async (employees: Employee[]) => {
        const loginId = this.authService.getUID();
        const mngDeptListRes =
          (await this.apiService
            .getManageDeptsListByUserId(loginId)
            .toPromise()) || ({} as ApiResponse<MngDeptListRes[]>);
        const mngDeptList = mngDeptListRes.responseData.result;
        const filteredEmployees = employees.filter((emp) =>
          mngDeptList.some((dept) => dept.deptId === emp.department.id)
        );

        const role = this.authService.checkRole();
        if (role == 'ROLE_Admin') {
          this.employees = filteredEmployees.map((employee) => ({
            id: employee.id,
            fullName: `${employee.firstname} ${employee.lastname}`,
          }));
        } else {
          this.employees = employees.map((employee) => ({
            id: employee.id,
            fullName: `${employee.firstname} ${employee.lastname}`,
          }));
        }
      });
  }

  async getBlob(userId: number) {
    try {
      const blob = await this.apiService.getSignatureImage(userId).toPromise();
      if (blob && blob.type.startsWith('image/')) {
        this.signatureImageUrl = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(blob)
        );
        this.errorMessage = null;
      } else {
        throw new Error('Invalid Blob or Blob is not an image');
      }
    } catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = 'ยังไม่มีลายเซ็นในระบบ';
      } else {
        this.errorMessage = 'An error occurred while fetching the signature.';
      }
      this.signatureImageUrl = null;
    }
  }
  onEmployeeSelect(userId: number) {
    this.selectedEmployeeId = userId;
    this.getBlob(userId);
  }

  getUploadFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.uploadedImageUrl = reader.result;
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  getUploadSignature(): void {
    if (this.selectedEmployeeId && this.selectedFile) {
      this.apiService
        .uploadSignature(this.selectedEmployeeId, this.selectedFile)
        .subscribe({
          next: async (response) => {
            await this.swalService.showSuccess('อัปโหลดลายเซ็นสำเร็จ');
            this.clear();
          },
          error: (error) => {
            this.swalService.showError('การอัปโหลดล้มเหลว');
          },
        });
    } else {
      this.swalService.showWarning('กรุณาเลือกลายเซ็นที่ต้องการอัปโหลด');
    }
  }

  protected clear() {
    setTimeout(() => {
      location.reload();
    }, 400);
  }
}

// ลายเซ็นถูกอัพโหลดเรียบร้อยแล้ว
