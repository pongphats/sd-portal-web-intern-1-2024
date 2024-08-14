import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SwalService } from './swal.service';
import { CreateTrainingRequestForm } from '../interface/request';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private trainingList = new BehaviorSubject<any[]>([]);

  constructor(private swalService: SwalService) {}

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

    // Check if the item already exists in the list
    const isDuplicate = currentList.some(
      (existingItem) => JSON.stringify(existingItem) === JSON.stringify(item)
    );

    if (isDuplicate) {
      // Alert the user if the item is already in the list
      this.swalService.showWarning('ฟอร์มนี้ถูกเพิ่มไปแล้ว');
    } else {
      // If the item is not a duplicate, push it to the list
      currentList.push(item);
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
      currentList.splice(index, 1);
      this.trainingList.next(currentList);
    } else {
      console.error('Index out of bounds');
    }
  }

  mappingCreatTrainingFormsToRequestForm(
    forms: any
  ): CreateTrainingRequestForm {
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
      fileID: [],
    };

    return requestForm;
  }
}
