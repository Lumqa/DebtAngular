import { Member } from './../../_models/member';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { TaskService } from './../../_services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Task } from './../../_models';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './addOrEditTasks.component.html'
})
export class AddOrEditTasksComponent implements OnInit {
  taskId: string;
  task: Task;
  editTaskForm: FormGroup;

  constructor(private taskService: TaskService, activateRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.taskId = activateRoute.snapshot.queryParams['taskId'];
  }

  get taskMembers(): FormArray {
    return (this.editTaskForm.get('members') as FormArray);
  }

  ngOnInit() {
    this.createForm();
    this.loadTasks();
    if (this.task === undefined) this.taskId = '00000000-0000-0000-0000-000000000000';
  }

  createForm() {
    this.editTaskForm = this.formBuilder.group({
      taskId: [''],
      userId: [''],
      name: [''],
      sum: [''],
      members: this.formBuilder.array([])
    });
    //this.addTaskMember();
  }

  addTaskMember(member?: Member): void {
    //this.task.members.push(new Member(this.taskId));
    let fg;
    if (member == null) {
      fg = this.formBuilder.group(new Member(this.taskId));
    } else {
      fg = this.formBuilder.group(member);
    }
    this.taskMembers.push(fg);
  }

  deleteMember(index:number) {
    this.taskMembers.removeAt(index);
  }

  loadTasks(): any {
    this.taskService.getAddOrEditTask(this.taskId).subscribe(task => {
      task.id ? this.task = task : this.task = new Task();
      this.editTaskForm.controls['taskId'].setValue(this.task.id);
      this.editTaskForm.controls['name'].setValue(this.task.name);
      this.editTaskForm.controls['sum'].setValue(this.task.sum);
      this.editTaskForm.controls['userId'].setValue(this.task.userId);
      this.task.members.forEach((item) => {this.addTaskMember(item);});
    });
  }

  saveTask() {
    let formValue = this.editTaskForm;
    this.task.name = formValue.get('name').value;
    this.task.sum = formValue.get('sum').value;
    this.task.members = [];
    formValue.get('members').value.forEach(element => {
      this.task.members.push(<Member>element);
    });
    this.taskService.save(this.task).subscribe();
    //this.router.navigate(['tasks']);
  }
}
