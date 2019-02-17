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

  constructor(private taskService: TaskService, activateRoute: ActivatedRoute) {
    this.taskId = activateRoute.snapshot.queryParams['taskId'];
  }

  ngOnInit() {
    this.loadTasks();
   
  }

  addTaskMember(): void {
    this.task.members.push(new Member(this.taskId));
  }

  loadTasks(): any {
    this.taskService.getAddOrEditTask(this.taskId).subscribe(task => task.id ? this.task = task : this.task = new Task());
  }

  save() {
    this.taskService.save(this.task).subscribe();
  }

  delete(member: Member) {
    this.task.members.forEach((item, index) => {
      if (item.id === member.id) this.task.members.splice(index, 1);
    });
    console.log(this.task);
  }
}
