import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { TaskService } from './../../_services';

import { Task } from './../../_models';

@Component({
  selector: 'app-tasks',
  templateUrl: './addOrEditTasks.component.html'
})
export class  AddOrEditTasksComponent implements OnInit {

  tasks: Task;
  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks(): any {
    this.taskService.getAddOrEditTask().pipe(first()).subscribe(tasks => {
      this.tasks = tasks;
      console.log(tasks);
    });
  }
}
