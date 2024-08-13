import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { sector } from '../interface/common';
import { ApiService } from './api.service';
import { SwalService } from './swal.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  trainingUrl: string = environment.trainingService;
  welfareUrl: string = environment.welfareService;

  private trainingList = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient, private apiService: ApiService, private swalService : SwalService) {}

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
    const isDuplicate = currentList.some(existingItem => JSON.stringify(existingItem) === JSON.stringify(item));
    
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

  getCompanyIdByName(name: string): Observable<number> {
    return this.http
      .get<number>(`${this.trainingUrl}/findIdByName`, {
        params: { param: name },
      })
      .pipe(map((res) => res));
  }

  getOnlyDeptCodeByCompany(company: string): Observable<any> {
    return this.http
      .get<any>(`${this.trainingUrl}/findAllJoinDepartmentsSector`)
      .pipe(
        map((res: any[]) => {
          const filteByCompany = res.filter(
            (item: any) => item.company === company
          );
          const mapByDeptCode = filteByCompany.map(
            (item: any) => item.department.deptCode
          );
          return mapByDeptCode.sort((a, b) => {
            return parseInt(a) - parseInt(b);
          });
        })
      );
  }

  generateAdminFullName(): Observable<string[]> {
    return this.http.get(`${this.trainingUrl}/findAllAdmin`).pipe(
      map((res: any) => {
        const adminsFullName = res.map((admin: any) => {
          return `${admin.title} ${admin.firstname} ${admin.lastname}`;
        });

        return adminsFullName;
      })
    );
  }

  formatDateToYYYYMMDDString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เพิ่ม 0 ถ้าเป็นเลขเดียว
    const day = String(date.getDate()).padStart(2, '0'); // เพิ่ม 0 ถ้าเป็นเลขเดียว
    return `${year}-${month}-${day}`;
  }

  toTimeStringHHMM24hr(timeInput: any) {
    const date = new Date(timeInput);
    const timeString = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return timeString;
  }

  async getSectorAndDeptsListByCompanyName(
    companyName = 'PCCTH'
  ): Promise<sector[]> {
    let sectors: sector[] = [];
    try {
      const res = await this.apiService
        .getSectorsDeptsCompanysList()
        .toPromise();
      if (res === undefined) {
        throw new Error('Sectors list is undefined');
      } else {
        sectors = res.filter((item: sector) => item.company == companyName);
      }
    } catch (error) {
      console.error(error);
    }
    console.log(sectors)
    return sectors;
  }

  convertNumberToStringFormatted(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
