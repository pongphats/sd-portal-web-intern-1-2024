import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-print-tips-modal',
  templateUrl: './print-tips-modal.component.html',
  styleUrls: ['./print-tips-modal.component.scss'],
})
export class PrintTipsModalComponent implements OnInit {
  isAdmin: boolean = false;
  isPersonnel: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.checkRole();
    this.isAdmin = role == 'ROLE_Admin';
    this.isPersonnel =
      role == 'ROLE_Personnel' || role == 'ROLE_ManagerAndROLE_Personnel';
  }
}
