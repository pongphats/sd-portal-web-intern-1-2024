import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { SectorManageForm } from 'src/app/interface/form';
import { CreateSectorRequest } from 'src/app/interface/request';


@Component({
  selector: 'app-manage-company',
  templateUrl: './manage-company.component.html',
  styleUrls: ['./manage-company.component.scss']
})
export class ManageCompanyComponent implements OnInit {
  

  sectorManageForm!: FormGroup<SectorManageForm>;

  constructor(
    private fb: FormBuilder
  ) {
    this.sectorManageForm = this.fb.group({
      company: ['PCCTH',[Validators.required]],
      sectorTname: ['',[Validators.required]],
      sectorEname: ['',[Validators.required]],
      sectorCode: ['',[Validators.required]],
      deptTname: ['', [Validators.required]],
      deptEname: ['',[Validators.required]],
      deptName: ['', Validators.required],
      deptCode: ['',[Validators.required]],
      deptManage: ['',[Validators.required]]
    })
    
   }

  ngOnInit(): void {
  }

  departmentControl = new FormControl('', [Validators.required]);

  adminEmps! : string[];

  // generateAdminFullName(): Observable<string[]>

  // createSectorAndDept(req: CreateSectorRequest):

  // getCompanyIdByName(name: String): Observable<number>

  



  

  
 

 

 
  

}
