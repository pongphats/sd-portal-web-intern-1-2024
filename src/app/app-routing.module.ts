import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';

import { SystemLayoutComponent } from './layouts/system-layout/system-layout.component';

import { FtrSv1PageComponent } from './pages/ftr-sv1-page/ftr-sv1-page.component';

import { ManagementRolePageComponent } from './pages/management-role-page/management-role-page.component';

import { AuthGuard } from './auth/guard/auth.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ManageCompanyComponent } from './pages/manage-company/manage-company.component';
import { ManageCoursePageComponent } from './pages/manage-course-page/manage-course-page.component';
import { TrainingFormPageComponent } from './pages/training-form-page/training-form-page.component';
import { WelfareFormsPageComponent } from './pages/welfare-forms-page/welfare-forms-page.component';
import { ManagementTrainingPageComponent } from './pages/management-training-page/management-training-page.component';
import { ManagementUserPageComponent } from './pages/management-user-page/management-user-page.component';
import { BudgetWellfareManagePageComponent } from './pages/budget-wellfare-manage-page/budget-wellfare-manage-page.component';
import { SignaturePageComponent } from './pages/signature-page/signature-page.component';
import { ApproverManagePageComponent } from './pages/approver-manage-page/approver-manage-page.component';
import { WelfareExpenseHistoryPageComponent } from './pages/welfare-expense-history-page/welfare-expense-history-page.component';
import { LoginWelfarePageComponent } from './pages/login-welfare-page/login-welfare-page.component';
import { UserViewPageComponent } from './pages/user-view-page/user-view-page.component';

const routes: Routes = new Array<Route>(
  {
    path: 'sign-in',
    component: LoginPageComponent,
  },
  {
    path: 'wellfare',
    component: LoginWelfarePageComponent,
  },
  {
    path: 'login-welfare',
    component: LoginWelfarePageComponent,
  },
  {
    path: 'pccth',
    component: SystemLayoutComponent,
    children: new Array<Route>(
      {
        path: 'management-training',
        component: ManagementTrainingPageComponent,
      },
      {
        path: 'management-budget',
        component: FtrSv1PageComponent,
      },
      {
        path: 'manage-course-page',
        component: ManageCoursePageComponent,
      },
      {
        path: 'management-role',
        component: ManagementRolePageComponent,
      },
      {
        path: 'management-company',
        component: ManageCompanyComponent,
      },
      {
        path: 'training-forms',
        component: TrainingFormPageComponent,
      },

      {
        path: 'management-users',
        component: ManagementUserPageComponent,
      },

      {
        path: 'signature-page',
        component: SignaturePageComponent,
      },

      {
        path: 'approver-manage',
        component: ApproverManagePageComponent,
      },
      {
        path: 'view-user',
        component: UserViewPageComponent,
      },
      {
        path: '',
        redirectTo: 'management-training',
      },
      {
        path: 'wellfare-portal',
        children: new Array<Route>(
          {
            path: 'welfare-expense-history',
            component: WelfareExpenseHistoryPageComponent,
          },
          {
            path: 'budget-wellfare-manage',
            component: BudgetWellfareManagePageComponent,
          },
          {
            path: 'welfare-forms',
            component: WelfareFormsPageComponent,
          },
          {
            path: 'management-users',
            component: ManagementUserPageComponent,
          },
          {
            path: 'management-company',
            component: ManageCompanyComponent,
          },
          { path: 'management-users', component: ManagementUserPageComponent },
          {
            path: '**',
            pathMatch: 'full',
            redirectTo: 'welfare-forms',
          }
        ),
      }
    ),
  },
  {
    path: '**',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  }
);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
