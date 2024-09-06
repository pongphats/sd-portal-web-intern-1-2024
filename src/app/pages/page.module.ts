import { NgModule } from '@angular/core';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { JobDayAddPageModule } from './job-day-add-page/job-day-add-page.module';

import { HomePageComponent } from './home-page/home-page.component';
import { CarouselNewsComponent } from './home-page/components/carousel-news/carousel-news.component';
import { ListCardSystemComponent } from './home-page/components/list-card-system/list-card-system.component';
import { ListDescriptionComponent } from './home-page/components/list-description/list-description.component';
import { ListCardPeopleComponent } from './home-page/components/list-card-people/list-card-people.component';
import { NewsPageComponent } from './news-page/news-page.component';
import { NewsTableComponent } from './news-page/components/news-table/news-table.component';
import { NewsDetailPageComponent } from './news-detail-page/news-detail-page.component';
import { CalenderPageComponent } from './calender-page/calender-page.component';
import { CalendarTableComponent } from './calender-page/components/calendar-table/calendar-table.component';
import { CalendarComponentsComponent } from './calender-page/components/calendar-components/calendar-components.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { InformationUserComponent } from './dashboard-page/components/information-user/information-user.component';
import { InformationProjectUserComponent } from './dashboard-page/components/information-project-user/information-project-user.component';
import { TreemapChartComponent } from './dashboard-page/components/treemap-chart/treemap-chart.component';
import { JobDayViewPageComponent } from './job-day-view-page/job-day-view-page.component';
import { ManagementNewsPageComponent } from './management-news-page/management-news-page.component';
import { ManagementDashboardPageComponent } from './management-dashboard-page/management-dashboard-page.component';
import { ManagementRolePageComponent } from './management-role-page/management-role-page.component';

import { SharedModule } from '../shared/shared.module';
import { FtrOf1PageComponent } from './ftr-of1-page/ftr-of1-page.component';
import { FtrOj1PageComponent } from './ftr-oj1-page/ftr-oj1-page.component';
import { FtrSv1PageComponent } from './ftr-sv1-page/ftr-sv1-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PccSdPortalComponentModule } from '../components/pcc-sd-portal-component.module';
import { MatIconModule } from '@angular/material/icon';
import { ManageCompanyComponent } from './manage-company/manage-company.component';
import { ManageCoursePageComponent } from './manage-course-page/manage-course-page.component';
import { TrainingFormPageComponent } from './training-form-page/training-form-page.component';
import { TraingCreateFormsTableComponent } from './training-form-page/components/traing-create-forms-table/traing-create-forms-table.component';
import { WelfareFormsPageComponent } from './welfare-forms-page/welfare-forms-page.component';
import { ManagementTrainingPageComponent } from './management-training-page/management-training-page.component';
import { ManagementUserPageComponent } from './management-user-page/management-user-page.component';
import { BudgetWellfareManagePageComponent } from './budget-wellfare-manage-page/budget-wellfare-manage-page.component';
import { SignaturePageComponent } from './signature-page/signature-page.component';
import { WelfareExpenseHistoryComponent } from './welfare-expense-history/welfare-expense-history.component';
import { DialogContentComponent } from './welfare-expense-history/dialog-content/dialog-content.component';
import { CheckTrainingModalComponent } from './management-training-page/components/check-training-modal/check-training-modal.component';
import { SectionOneFormComponent } from './management-training-page/components/section-one-form/section-one-form.component';
import { SectionTwoFormComponent } from './management-training-page/components/section-two-form/section-two-form.component';
import { Generic9FormComponent } from './management-training-page/components/generic9-form/generic9-form.component';
import { ApproverManagePageComponent } from './approver-manage-page/approver-manage-page.component';
import { ReportModalComponent } from './management-training-page/components/report-modal/report-modal.component';
import { PrintTipsModalComponent } from './management-training-page/components/print-tips-modal/print-tips-modal.component';
import { WelfareExpenseHistoryPageComponent } from './welfare-expense-history-page/welfare-expense-history-page.component';
@NgModule({
  declarations: [
    HomePageComponent,
    CarouselNewsComponent,
    ListCardSystemComponent,
    ListDescriptionComponent,
    ListCardPeopleComponent,
    NewsPageComponent,
    CalenderPageComponent,
    CalendarTableComponent,
    DashboardPageComponent,
    InformationUserComponent,
    InformationProjectUserComponent,
    JobDayViewPageComponent,
    ManagementNewsPageComponent,
    ManagementDashboardPageComponent,
    ManagementRolePageComponent,
    CalendarComponentsComponent,
    NewsTableComponent,
    TreemapChartComponent,
    NewsDetailPageComponent,
    FtrOf1PageComponent,
    FtrOj1PageComponent,
    FtrSv1PageComponent,
    LoginPageComponent,
    ManageCompanyComponent,
    ManageCoursePageComponent,
    TrainingFormPageComponent,
    TraingCreateFormsTableComponent,
    WelfareFormsPageComponent,
    ManagementTrainingPageComponent,
    ManagementUserPageComponent,
    BudgetWellfareManagePageComponent,
    SignaturePageComponent,
    WelfareExpenseHistoryComponent,
    DialogContentComponent,
    CheckTrainingModalComponent,
    SectionOneFormComponent,
    SectionTwoFormComponent,
    Generic9FormComponent,
    ApproverManagePageComponent,
    ReportModalComponent,
    PrintTipsModalComponent,
    WelfareExpenseHistoryPageComponent,
  ],
  imports: [
    MatIconModule,
    SharedModule,
    JobDayAddPageModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    PccSdPortalComponentModule,
  ],
})
export class PageModule {}
