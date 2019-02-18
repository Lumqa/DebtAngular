import { Member } from './../../_models/member';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { TaskService } from './../../_services';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidationErrors } from '@angular/forms';

import { Task } from './../../_models';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { elementStyleProp } from '@angular/core/src/render3';

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

  ngOnInit() {
    this.createForm();
    this.loadTasks();
    if (this.task === undefined) this.taskId = '00000000-0000-0000-0000-000000000000';
  }

  get taskMembers(): FormArray {
    return (this.editTaskForm.get('members') as FormArray);
  }

  addTaskMember(member?: Member): void {
    //this.task.members.push(new Member(this.taskId));
    let fg;
    if (member == null) {
      fg = this.formBuilder.group(new Member(this.taskId), { validator: this.MemberNameValidator });
    } else {
      fg = this.formBuilder.group(member, { validator: this.MemberNameValidator });
    }
    this.taskMembers.push(fg);
  }

  createForm() {
    this.editTaskForm = this.formBuilder.group({
      taskId: [''],
      userId: [''],
      name: ['', Validators.required],
      sum: ['0', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]{0,10}$')]],
      members: this.formBuilder.array([])
    }, { validator: this.SumValidator, validateName: this.MemberNameValidator });
    //this.addTaskMember();
  }

  SumValidator(fg: FormGroup) {
    let sumControl = fg.get('sum');
    let sumValue = sumControl.value;
    let sumDeposit = 0;
    let sumDebt = 0;
    fg.get('members').value.forEach(element => {
      //sumDeposit = parseFloat(sumDeposit + (<Member>element).deposit);
      //sumDebt += parseFloat((<Member>element).debt);
    });


    if (sumDeposit != sumValue && sumDebt != sumValue) {
      sumControl.setErrors({ DepositSumError: true, DebtSumError: true });
    }
    else {
      if (sumDeposit != sumValue) {
        sumControl.setErrors({ DepositSumError: true });
      }
      else {
        if (sumDebt != sumValue) {
          sumControl.setErrors({ DebtSumError: true });
        }
        else {
          sumControl.setErrors(null);
        }
      }
    }
  }

  MemberNameValidator(fg: FormGroup) {
  }


  deleteMember(index: number) {
    this.taskMembers.removeAt(index);
  }

  loadTasks(): any {
    this.taskService.getAddOrEditTask(this.taskId).subscribe(task => {
      if (task.id != undefined) {
        this.task = task
        this.editTaskForm.controls['taskId'].setValue(this.task.id);
        this.editTaskForm.controls['name'].setValue(this.task.name);
        this.editTaskForm.controls['sum'].setValue(this.task.sum);
        this.editTaskForm.controls['userId'].setValue(this.task.userId);
        this.task.members.forEach((item) => { this.addTaskMember(item); });
      } else {
        this.task = new Task();
      }
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
