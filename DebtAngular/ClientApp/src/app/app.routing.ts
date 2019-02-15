
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { TasksComponent } from './tasks/tasks.component';
import { AddOrEditTasksComponent } from './tasks/AddOrEditTask/addOrEditTasks.component';
import { DebtsComponent } from './debts/debts.component';
const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'tasks', component: TasksComponent },
    { path: 'debts', component: DebtsComponent },
    { path: 'addOrEditTask', component: AddOrEditTasksComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
