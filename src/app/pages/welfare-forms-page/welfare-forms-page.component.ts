import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { welfareForm } from 'src/app/interface/form';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-welfare-forms-page',
  templateUrl: './welfare-forms-page.component.html',
  styleUrls: ['./welfare-forms-page.component.scss']
})
export class WelfareFormsPageComponent implements OnInit {
  welfareForm!: FormGroup<welfareForm>;

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private commonService: CommonService,
    private apiService: ApiService,
  ) {
    this.welfareForm = this.fb.group({
      fullName: [''],
    })
  }

  ngOnInit(): void {

    //Auto
    // this.filteredOptions = this.welfareForm.get('fullName')!.valueChanges.pipe(
    //   startWith(''),
    //   map(value => (typeof value === 'string' ? value : '')),
    //   map(fullName => (fullName ? this._filter(fullName) : this.listEmp.slice())),
    // );

    // this.genAdmin("")


  }

  //Auto
  // listEmp: string[] = [];
  // async genAdmin(term: string) {
  //   try {
  //     //api
  //     const res = await this.apiService.getEmplistByName(term).toPromise();
  //     if (res) {
  //       this.listEmp = res;
  //       console.log(res)
  //     } else {
  //       this.listEmp = [];
  //     }

  //   }

  //   catch (error) {
  //     console.error('Error generating admin full names:', error);
  //   }
  // }
  //Auto
  // filteredOptions!: Observable<string[]>;

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.listEmp
  //     .filter((option: string) => option.toLowerCase().includes(filterValue))
  //     .sort();
  // }
}
