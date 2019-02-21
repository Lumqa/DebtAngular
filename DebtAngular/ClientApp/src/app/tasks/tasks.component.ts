import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { TaskService } from './../_services';
import { ActivatedRoute, Router } from '@angular/router';

import { Task } from './../_models';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  constructor(private taskService: TaskService, route: ActivatedRoute) {
    
    route.params.subscribe(val => {
      this.loadTasks();
    });}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks(): any {
    this.tasks=[];
    this.taskService.getAll().pipe(first()).subscribe(tasks => {
      console.log(tasks);
      this.tasks = tasks;
    });
  }

  Delete(task: Task) {
    this.taskService.delete(task.id).pipe(first()).subscribe(() => {
      this.loadTasks();
    });
  }

  addOrEditTask(): any {
    this.taskService.getAll().pipe(first()).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

}
