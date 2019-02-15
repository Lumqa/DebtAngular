import { Member } from './../../_models/member';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { TaskService } from './../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Task } from './../../_models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './addOrEditTasks.component.html'
})
export class AddOrEditTasksComponent implements OnInit {
  taskId: string;
  userId: string;
  task: Task;
  editTaskForm: FormGroup;

  get taskMembers(): FormArray {
    return (this.editTaskForm.get('members') as FormArray);
  }

  addTaskMember() {
    let fg = this.formBuilder.group(new Member(this.taskId));
    this.taskMembers.push(fg);
  }

  constructor(private taskService: TaskService, private activateRoute: ActivatedRoute, private formBuilder: FormBuilder) {
    this.taskId = activateRoute.snapshot.queryParams['taskId'];
  }

  ngOnInit() {
    this.loadTasks();
    this.editTaskForm = this.formBuilder.group({
      taskId: [''],
      userId: [''],
      name: [''],
      sum: [''],
      members: this.formBuilder.array([])
    });
    this.addTaskMember();
  }



  loadTasks(): any {
    this.taskService.getAddOrEditTask(this.taskId).pipe(first()).subscribe(task => {
      this.task = task;
      this.userId = task.userId;
      console.log(this.task);
    });
  }
}
