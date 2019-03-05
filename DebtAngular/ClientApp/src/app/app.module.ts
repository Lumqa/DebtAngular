import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { TasksComponent } from './tasks/tasks.component';
import { DebtsComponent } from './debts/debts.component';
import { AddOrEditTasksComponent } from './tasks/AddOrEditTask/addOrEditTasks.component';
import { NotFoundComponent } from './notfound/notfound.component';
import { FullInfoModule } from './debts/full-info/full-info.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
    FormsModule,
    MDBBootstrapModule,
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        NotFoundComponent,
        LoginComponent,
        RegisterComponent,
        TasksComponent,
        DebtsComponent,
        AddOrEditTasksComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
