import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';

import { SystemLayoutComponent } from './layouts/system-layout/system-layout.component';

import { CalenderPageComponent } from './pages/calender-page/calender-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { FtrOf1PageComponent } from './pages/ftr-of1-page/ftr-of1-page.component';
import { FtrOj1PageComponent } from './pages/ftr-oj1-page/ftr-oj1-page.component';
import { FtrSv1PageComponent } from './pages/ftr-sv1-page/ftr-sv1-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { JobDayViewPageComponent } from './pages/job-day-view-page/job-day-view-page.component';
import { ManagementDashboardPageComponent } from './pages/management-dashboard-page/management-dashboard-page.component';
import { ManagementNewsPageComponent } from './pages/management-news-page/management-news-page.component';
import { ManagementRolePageComponent } from './pages/management-role-page/management-role-page.component';
import { NewsDetailPageComponent } from './pages/news-detail-page/news-detail-page.component';
import { NewsPageComponent } from './pages/news-page/news-page.component';
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
import { WelfareExpenseHistoryComponent } from './pages/welfare-expense-history/welfare-expense-history.component';
import { ApproverManagePageComponent } from './pages/approver-manage-page/approver-manage-page.component';

const routes: Routes = new Array<Route>(
  {
    path: 'sign-in',
    component: LoginPageComponent,
  },
  {
    path: 'pccth',
    component: SystemLayoutComponent,
    children: new Array<Route>(
      {
        path: '',
        pathMatch: 'full',
        component: HomePageComponent,
      },
      {
        path : "test",
        component : FtrOf1PageComponent
      },
      {
        path: 'news',
        component: NewsPageComponent,
      },
      {
        path: 'calender',
        component: CalenderPageComponent,
      },
      {
        path: 'dashboard',
        component: DashboardPageComponent,
      },
      {
        path: 'ftr-of1',
        component: FtrOf1PageComponent,
      },
      {
        path: 'management-training',
        component: ManagementTrainingPageComponent,
      },
      {
        path: 'ftr-sv1',
        component: FtrSv1PageComponent,
      },
      {
        path: 'manage-course-page',
        component: ManageCoursePageComponent,
      },
      {
        path: 'job-day-view',
        component: JobDayViewPageComponent,
      },
      {
        path: 'management-news',
        component: ManagementNewsPageComponent,
      },
      {
        path: 'management-dashboard',
        component: ManagementDashboardPageComponent,
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
        path: 'news-detail',
        component: NewsDetailPageComponent,
      },
      {
        path: 'training-forms',
        component: TrainingFormPageComponent,
      },
      {
        path: 'training-forms/edit/:id',
        component: TrainingFormPageComponent,
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
        path: 'budget-wellfare-manage',
        component: BudgetWellfareManagePageComponent,
      },
      {
        path: 'signature-page',
        component: SignaturePageComponent,
      },
      {
        path: 'welfare-expense-history',
        component: WelfareExpenseHistoryComponent,
      },
      {
        path: 'approver-manage',
        component: ApproverManagePageComponent,
      },
    ),
  },
  {
    // Redirects all paths that are not matching to the 'sign-in' route/path
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
