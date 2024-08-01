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
const routes: Routes = new Array<Route>(
  {
    path: '',
    component: SystemLayoutComponent,
    children: new Array<Route>(
      {
        path: '',
        pathMatch: 'full',
        component: HomePageComponent,
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
        path: 'ftr-oj1',
        component: FtrOj1PageComponent,
      },
      {
        path: 'ftr-sv1',
        component: FtrSv1PageComponent,
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
        path: 'news-detail',
        component: NewsDetailPageComponent,
      }
    ),
  }
);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
