
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { TasksComponent } from './tasks/tasks.component';
import { AddOrEditTasksComponent } from './tasks/AddOrEditTask/addOrEditTasks.component';
import { DebtsComponent } from './debts/debts.component';
import { NotFoundComponent } from './notfound/notfound.component';
const appRoutes: Routes = [
    { path: '', component: TasksComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
    { path: 'debts', component: DebtsComponent, canActivate: [AuthGuard] },
    { path: 'addOrEditTask', component: AddOrEditTasksComponent, canActivate: [AuthGuard] },
    { path: '404', component: NotFoundComponent },
    { path: 'full-info', loadChildren: './debts/full-info/full-info.module#FullInfoModule' },

    // otherwise redirect to home
  { path: '**', redirectTo: '404' }
];

export const routing = RouterModule.forRoot(appRoutes);
