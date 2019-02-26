import { Member } from './../../_models/member';
import { Component, OnInit, OnChanges } from '@angular/core';
import { first } from 'rxjs/operators';
import { TaskService } from './../../_services';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidationErrors } from '@angular/forms';

import { Task } from './../../_models';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
declare var task: any;


@Component({
  selector: 'app-tasks',
  templateUrl: './addOrEditTasks.component.html'
})

export class AddOrEditTasksComponent implements OnInit, OnChanges {
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
    this.editTaskForm.get('sum').valueChanges.subscribe(control=>{
      this.task.sum=control;
      this.changeSum();
    });
  }


  ngOnChanges(changes) {
  }

  get taskMembers(): FormArray {
    return (this.editTaskForm.get('members') as FormArray);
  }

  addTaskMember(member?: Member): void {
    this.fillingMemberData(member);
  }

  resolveAfterSeconds(x) {
    return new Promise(resolve => { setTimeout(() => { resolve(x); }, 0);});
  }

  addMember() {
    let newMember = new Member(this.task.id);
    this.task.members.push(newMember);
    this.resolveAfterSeconds(this.addTaskMember(newMember)).then(() => {this.changeSum();});
  }

  fillingMemberData(member: Member) {
    let fg = this.formBuilder.group(
      {
      id: [member.id],
      name: [member.name, Validators.required],
      deposit: [member.deposit, [Validators.required, Validators.min(0)]],
      debt: [member.debt, [Validators.required, Validators.min(0)]],
      taskId: [member.taskId]
      }
    );
    this.taskMembers.push(fg);
  }

  createForm() {
    this.editTaskForm = this.formBuilder.group({
      taskId: [''],
      userId: [''],
      name: ['', Validators.required],
      sum: ['0', [Validators.required, Validators.min(0)]],
      members: this.formBuilder.array([])
    });
    //this.addTaskMember();
  }

  sumValidator() {
    let fg = this.editTaskForm;
    var depositInputs = this.task.members;
    var debtsInputs = this.task.members;
    var nameInputs = document.getElementsByClassName("name");
    if(depositInputs.length==0) return;
    let sumControl = fg.get('sum');
    let sumValue = sumControl.value;

    var sumDeposit = this.CalculateDepositSum(depositInputs, depositInputs.length);
    var sumDebt = this.CalculateDebtSum(debtsInputs, debtsInputs.length);


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

  nameValidator(index) {
    var nameInputs = document.getElementsByClassName('name');
    let dupNames = [];
    var editedInput = nameInputs[index]['value'];
    for (var i = 0; i < nameInputs.length; i++) {
      this.taskMembers.controls[i].get('name').updateValueAndValidity();
      if ((editedInput === nameInputs[i]['value'] && index!=i)) {
        dupNames.push(i);
      }
    }
    dupNames.push(index);
    if(dupNames.length>1)
    dupNames.forEach(index=>{
      this.taskMembers.controls[index].get('name').setErrors({ match: true });
    });
  }

  deleteMember(index: number) {
    this.task.members.splice(index,1);
    this.resolveAfterSeconds(this.taskMembers.removeAt(index)).then(() => {this.changeSum();});
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

  saveTask(fg:FormGroup) {
    let formValue = this.editTaskForm;
    this.task.name = formValue.get('name').value;
    this.task.sum = formValue.get('sum').value;
    this.task.members = [];

    var depositInputs = document.getElementsByClassName("deposit");
    var debtsInputs = document.getElementsByClassName("saveDebt");

    formValue.get('members').value.forEach((element,index) => {
      let member=<Member>element;
      member.deposit = depositInputs[index]['value'];
      member.debt = debtsInputs[index]['value'];
      this.task.members.push(<Member>element);
    });
    this.taskService.save(this.task).subscribe(() => this.router.navigate(['tasks']));
  }

  //JS OPERATIONS
   changeSum() {
     //value in sum field
     var sumInput = this.task.sum;
     //change first field "deposit"
     var depositInputs = this.task.members;
     if (depositInputs.length === 0) return;
     depositInputs[0].deposit = sumInput;

    //get all inputs with manual edit value
     var debtsEditInputs = [];
    if (debtsEditInputs.length != 0) {
      var debtsEditSum = 0;
      //caclulate sum without this fields
      debtsEditSum = this.CalculateDebtSum(debtsEditInputs, debtsEditInputs.length);

      sumInput -= debtsEditSum;
    }

    //get all inputs with "debts"
     var debtsInputs = this.task.members;
    var debtsLength = debtsInputs.length;
    //calculate basic value
    var basicValueWithError = parseFloat((sumInput / debtsLength).toFixed(2));

    //calculate sum value with error
    var sumWithError = basicValueWithError * debtsLength;

    //get error
    var error = parseFloat((sumInput - sumWithError).toFixed(2));

    //global iterator for set correct debt value
    var iterator = 0;
    if (error != 0) {
      //check sing in error
      var sign = (error >= 0) ? true : false;
      while (error != 0) {
        //check sign and inc or dec value for correct value
        switch (sign) {
          case false:
            error = parseFloat((error + 0.01).toFixed(2));
            debtsInputs[iterator].debt = parseFloat((basicValueWithError - 0.01).toFixed(2));
            break;

          case true:
            error = parseFloat((error - 0.01).toFixed(2));
            debtsInputs[iterator].debt = parseFloat((basicValueWithError + 0.01).toFixed(2));
            break;
        }
        iterator++;
      }
    }

    //set value for other inputs, if needed
     while (iterator < debtsLength) {
       debtsInputs[iterator].debt = basicValueWithError;
      iterator++;
     }
     
    this.changeDeposit();
  }

  changeDebt(editedInput) {
    this.sumValidator();
    editedInput.path[0].classList.add('editing');
    editedInput.path[0].classList.remove('debt');
  }


  changeDeposit() {
    this.sumValidator();
  }
  //replace all sum calc
  CalculateDepositSum(inputs, length) {
    var sum = 0;
    for (var iterator = 0; iterator < length; iterator++) {
      sum += parseFloat(inputs[iterator].deposit);
    }
    return parseFloat(sum.toFixed(2));
  }

  CalculateDebtSum(inputs, length) {
    var sum = 0;
    for (var iterator = 0; iterator < length; iterator++) {
      sum += parseFloat(inputs[iterator].debt);
    }
    return parseFloat(sum.toFixed(2));
  }
}
