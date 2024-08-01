import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ftr-of1-page',
  templateUrl: './ftr-of1-page.component.html',
  styleUrls: ['./ftr-of1-page.component.scss']
})
export class FtrOf1PageComponent implements OnInit {
  sectionOne: any;
  sectionTwo: any;

  @ViewChild('etcRadio') etcRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('failRadio') failRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('noResultRadio') noResultRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('trainingRadio') trainingRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('getResultRadio') getResultRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('testRadio') testRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('getCertificateRadio') getCertificateRadio!: ElementRef<HTMLInputElement>;
  onTextareaClick() {
    this.etcRadio.nativeElement.checked = true;
  }

  onInputTextClick(typeResult: string) {
    if (typeResult === 'fail') {
      this.failRadio.nativeElement.checked = true;
    }else if (typeResult === 'noResult') {
      this.noResultRadio.nativeElement.checked = true;
    }
  }

  onDateClick(typeRadio: string) {
    if (typeRadio === 'training') {
      this.trainingRadio.nativeElement.checked = true;
    }else if (typeRadio === 'getResult') {
      this.getResultRadio.nativeElement.checked = true;
    }else if (typeRadio === 'test') {
      this.testRadio.nativeElement.checked = true;
    }else if (typeRadio === 'getCertificate') {
      this.getCertificateRadio.nativeElement.checked = true;
    }
}
  

  

  // sectionOne = new FormGroup({
  //   code: new FormControl('')
  // });

  constructor(private fb: FormBuilder) {
   }

  ngOnInit(): void {
    this.sectionOne = this.fb.group({
      code: ['', Validators.required]
    }),
    this.sectionTwo = this.fb.group({
      name: ['', Validators.required]
    })
  }

  save(){
    console.log(this.sectionOne.valid, this.sectionTwo.valid)
    console.log(this.sectionOne.value)
    console.log(this.sectionTwo.value)
  }

  // onSubmit(){
  //   console.log(this.sectionOne.value);
  // }

}
