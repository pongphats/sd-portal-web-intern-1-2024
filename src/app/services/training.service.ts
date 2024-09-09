import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { SwalService } from './swal.service';
import {
  CreateTrainingRequestForm,
  EditSectionTwoRequest,
} from '../interface/request';
import { CommonService } from './common.service';
import { AuthService } from './auth.service';
import { TrainingTable } from '../interface/training';
import { BudgetCreated, DeptBudget } from '../interface/common';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private trainingList = new BehaviorSubject<any[]>([]);

  private _trainingEditId!: number;

  private _trainingEditData!: TrainingTable;

  private _trainingRequest!: CreateTrainingRequestForm;

  private trainingEditFormsInValid = new BehaviorSubject<boolean>(true);

  private _trainingStatus!: string;

  private _sectionTwoRequest!: EditSectionTwoRequest;

  private _reportBase64!: string;

  private _pdfReportFileName!: string;

  private _deptBudgetCreated: BudgetCreated[] = [];

  // private _deptBudgetList

  adminId: number = 0;

  constructor(
    private swalService: SwalService,
    private commonService: CommonService,
    private authService: AuthService
  ) {
    this.adminId = this.authService.getUID();
  }

  // set trainingEditFormsInValid(value: boolean) {
  //   this._trainingEditFormsInValid = value;
  // }

  // get trainingEditFormsInValid(): boolean {
  //   return this._trainingEditFormsInValid;
  // }
  // Getter for trainingStatus

  // Getter _sectionTwoRequest

  get deptBudgetCreated(): BudgetCreated[] {
    return this._deptBudgetCreated;
  }

  set deptBudgetCreated(value: BudgetCreated[]) {
    this._deptBudgetCreated = value;
  }

  get pdfReportFileName(): string {
    return this._pdfReportFileName;
  }

  set pdfReportFileName(value: string) {
    this._pdfReportFileName = value;
  }

  get reportBase64(): string {
    return this._reportBase64;
  }

  set reportBase64(value: string) {
    this._reportBase64 = value;
  }

  get sectionTwoRequest(): EditSectionTwoRequest {
    return this._sectionTwoRequest;
  }

  set sectionTwoRequest(value: EditSectionTwoRequest) {
    this._sectionTwoRequest = value;
  }

  get trainingStatus(): string {
    return this._trainingStatus;
  }

  // Setter for trainingStatus
  set trainingStatus(status: string) {
    this._trainingStatus = status;
  }

  set trainingRequest(value: CreateTrainingRequestForm) {
    this._trainingRequest = value;
  }

  get trainingRequest(): CreateTrainingRequestForm {
    return this._trainingRequest;
  }

  set trainingEditData(value: TrainingTable) {
    this._trainingEditData = value;
  }

  get trainingEditData(): TrainingTable {
    return this._trainingEditData;
  }

  // Getter for trainingEditId
  get trainingEditId(): number {
    return this._trainingEditId;
  }

  // Setter for trainingEditId
  set trainingEditId(id: number) {
    this._trainingEditId = id;
  }

  findRemainingByDeptCode(deptCode: string) {
    return this._deptBudgetCreated.find(
      (item) => item.departmentCode == deptCode
    );
  }

  pushSumBudget(data: BudgetCreated) {
    const currentList = this._deptBudgetCreated;
    const isAddedBudget = currentList.find(
      (item) => item.departmentCode === data.departmentCode
    );

    if (isAddedBudget) {
      const calculate: BudgetCreated = {
        ...isAddedBudget,
        budgetCer: isAddedBudget.budgetCer + data.budgetCer,
        budgetTraining: isAddedBudget.budgetTraining + data.budgetTraining,
      };

      // แทนที่รายการใน currentList ที่ตรงกับ isAddedBudget ด้วย calculate
      const updatedList = currentList.map((item) =>
        item.departmentCode === isAddedBudget.departmentCode ? calculate : item
      );

      // อัพเดทค่าใน _deptBudgetCreated
      this._deptBudgetCreated = updatedList;
    } else {
      // เพิ่มข้อมูลใหม่ถ้ายังไม่มีใน currentList
      this._deptBudgetCreated = [...currentList, data];
    }
  }

  calculateBudget() {}

  setTrainingEditFormsInValid(value: boolean) {
    this.trainingEditFormsInValid.next(value);
  }

  getTrainingEditFormsInValid(): Observable<boolean> {
    return this.trainingEditFormsInValid.asObservable();
  }

  setTrainingList(value: any[]) {
    this.trainingList.next(value);
  }

  // Method to get the trainingList as an observable
  getTrainingList(): Observable<any[]> {
    return this.trainingList.asObservable();
  }

  // Push a new item to the trainingList
  pushTraining(item: any) {
    const currentList = this.trainingList.getValue();

    // console.log('currentList', currentList);
    // console.log('push item', item);

    // Check if the item already exists in the list
    const isDuplicate = currentList.some((existingItem) => {
      const hasEmpCode = existingItem.employeeId == item.employeeId;
      const hasCourse = existingItem.courseId == item.courseId;
      const hasType = existingItem.formsType == item.formsType;
      return hasEmpCode && hasCourse && hasType;
    });

    if (isDuplicate) {
      // Alert the user if the item is already in the list
      this.swalService.showWarning('ฟอร์มนี้ถูกเพิ่มไปแล้ว');
    } else {
      // If the item is not a duplicate, push it to the list
      currentList.push(item);
      // console.log('after psuh', currentList);

      this.trainingList.next(currentList);
    }
  }

  // Pop the last item from the trainingList
  popTraining() {
    const currentList = this.trainingList.getValue();
    currentList.pop();
    this.trainingList.next(currentList);
  }

  // Update an item at a specific index in the trainingList
  updateTraining(index: number, item: any) {
    const currentList = this.trainingList.getValue();
    if (index >= 0 && index < currentList.length) {
      currentList[index] = item;
      this.trainingList.next(currentList);
    } else {
      console.error('Index out of bounds');
    }
  }

  // Remove an item at a specific index in the trainingList
  removeTraining(index: number) {
    const currentList = this.trainingList.getValue();
    if (index >= 0 && index < currentList.length) {
      console.log(currentList[index], typeof currentList[index]);
      const coursePrice = Number(
        currentList[index].coursePrice.replace(/,/g, '')
      );
      const deptCode = currentList[index].deptCode;
      const formsType = currentList[index].formsType;

      this.reduceBudgetByCreated(coursePrice, deptCode, formsType);

      // console.log();

      currentList.splice(index, 1);
      this.trainingList.next(currentList);
    } else {
      console.error('Index out of bounds');
    }
  }

  reduceBudgetByCreated(
    coursePrice: number,
    deptCode: string,
    formsType: string
  ) {
    const currentBudgetList = this._deptBudgetCreated;
    const index = currentBudgetList.findIndex(
      (item) => item.departmentCode === deptCode
    );

    if (index !== -1) {
      const selectedBudget = currentBudgetList[index];
      const calculate: BudgetCreated = {
        ...selectedBudget,
        budgetCer:
          formsType === 'getCertificate'
            ? selectedBudget.budgetCer - coursePrice
            : selectedBudget.budgetCer,
        budgetTraining:
          formsType === 'training'
            ? selectedBudget.budgetTraining - coursePrice
            : selectedBudget.budgetTraining,
      };

      // แทนที่รายการเดิมใน this._deptBudgetCreated
      this._deptBudgetCreated = [
        ...currentBudgetList.slice(0, index),
        calculate,
        ...currentBudgetList.slice(index + 1),
      ];      
    }
  }

  mappingCreatTrainingFormsToRequestForm(forms: any) {
    const requestForm: CreateTrainingRequestForm = {
      userId: 0,
      dateSave: '',
      action: '',
      actionDate: '',
      createBy: 0,
      budgetType: '',
      projectCourse: '',
      etcDetails: '',
      day: 0,
      courseId: 0,
      budget: 0,
      approverId: 0,
      managerId: 0,
      vicepresident1Id: 0,
      vicepresident2Id: 0,
      presidentId: 0,
      fileID: [0],
    };

    requestForm.userId = forms.empId;
    requestForm.dateSave = this.commonService.formatDateToYYYYMMDDString(
      forms.addMissionDate
    );
    requestForm.action = forms.formsType;
    requestForm.actionDate = requestForm.dateSave;
    requestForm.createBy = forms.adminId;
    requestForm.budgetType = forms.budgetType;
    requestForm.budget = Number(forms.coursePrice.replace(/,/g, ''));
    requestForm.projectCourse = forms.courseProject;
    requestForm.etcDetails = forms.budgetDescription;
    requestForm.courseId = forms.courseId;
    requestForm.approverId = forms.approveId;
    requestForm.managerId = forms.managerId;
    requestForm.vicepresident1Id = forms.vicePresIdOne;
    requestForm.vicepresident2Id = forms.vicePresIdTwo;
    requestForm.presidentId = forms.presidentId;
    if (forms.fileID) {
      requestForm.fileID = [...forms.fileID];
    }
    return requestForm;
  }

  // async saveTrainingForms() {
  //   try {

  //   } catch (error) {

  //   }
  // }
}
