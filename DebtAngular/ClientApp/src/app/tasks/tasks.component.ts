import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { TaskService } from './../_services';

import { Task } from './../_models';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks(): any {
    this.taskService.getAll().pipe(first()).subscribe(tasks => {
      this.tasks = tasks;
      console.log(tasks);
    });
  }

  addOrEditTask(): any {
    this.taskService.getAll().pipe(first()).subscribe(tasks => {
      this.tasks = tasks;
    });
  }
}
