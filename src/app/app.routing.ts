import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
//Guards
import { AuthGuard } from "./guards/auth.guard";

const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);