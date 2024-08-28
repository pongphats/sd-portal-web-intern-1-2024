import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/interface/employee';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.scss'],
})
export class NewsPageComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) {}
  async ngOnInit() {
    // const data = await this.commonService.getSectorCompanyName('WiseSoft')

    const deptData = await this.apiService
      .getAllPrivilegeApprovers()
      .toPromise();
    const roles: Role[] = [
      {
        id: 1,
        role: 'Manager',
      },
      {
        id: 1,
        role: 'Personnel',
      },
    ];
    const roleTh = this.commonService.translateRole(roles);
    console.log(roleTh);
  }
}
