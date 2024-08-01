import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ftr-oj1-page',
  templateUrl: './ftr-oj1-page.component.html',
  styleUrls: ['./ftr-oj1-page.component.scss']
})
export class FtrOj1PageComponent implements OnInit {
  searchForm: any;
  name: any;
  position: any;
  department: any;

 

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      fname: ['ณิชธิตรา เมฆาพงศ์พันธุ์', Validators.required],
      position: ['Programmer', Validators.required],
      department: ['SD1', Validators.required],
    });
  }

  searchBtn(){
    console.log(this.searchForm.valid)
    console.log(this.searchForm.value);
    this.name = this.searchForm.value.fname;
    this.position = this.searchForm.value.position;
    this.department = this.searchForm.value.department;
    this.searchForm.reset();
  }
}
