import { Member } from './../../_models/member';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { TaskService } from './../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Task } from './../../_models';
import { ActivatedRoute } from '@angular/router';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './addOrEditTasks.component.html'
})
export class AddOrEditTasksComponent implements OnInit {
  taskId: string;
  task: Task;

  constructor(private taskService: TaskService, private activateRoute: ActivatedRoute) {
    this.taskId = activateRoute.snapshot.queryParams['taskId'];
  }

  ngOnInit() {
    this.loadTasks();
  }

  addTaskMember(): void {
    this.task.members.push(new Member(this.taskId));
  }

  loadTasks(): any {
    this.taskService.getAddOrEditTask(this.taskId).subscribe(task => this.task = task);
  }

  save() {
    this.taskService.save(this.task);
  }
}
