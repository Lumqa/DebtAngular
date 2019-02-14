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

  Delete(task: Task) {
    this.taskService.delete(task.id).pipe(first()).subscribe(() => {
      this.loadTasks()
    });
    // let index = this.tasks.findIndex(t => t.id === task.id); //find index in your array
    // this.tasks.splice(index, 1);//remove element from array
    // this.taskService.delete(task.id);
    // console.log(task);
  }

  addOrEditTask(): any {
    this.taskService.getAll().pipe(first()).subscribe(tasks => {
      this.tasks = tasks;
    });
  }
}
