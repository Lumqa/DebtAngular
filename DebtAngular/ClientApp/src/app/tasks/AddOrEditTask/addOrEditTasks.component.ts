import { Member } from './../../_models/member';
import { Component, OnInit, OnChanges } from '@angular/core';
import { first } from 'rxjs/operators';
import { TaskService } from './../../_services';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidationErrors } from '@angular/forms';

import { Task } from './../../_models';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { elementStyleProp } from '@angular/core/src/render3';
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
      this.changeSum();
      console.log('changesum');
    });
  }
  //ngAfterViewChecked() {
  //  this.changeSum();
  //}

  ngOnChanges(changes) {
    console.log(changes)
  }

  get taskMembers(): FormArray {
    return (this.editTaskForm.get('members') as FormArray);
  }

  addTaskMember(member?: Member): void {
    if (member == null) {
      this.fillingMemberData(new Member(this.taskId));
    } else {
      this.fillingMemberData(member);
    }
  }

  resolveAfterSeconds(x) {
    return new Promise(resolve => { setTimeout(() => { resolve(x); }, 0);});
  }

  addMember() {
    this.resolveAfterSeconds(this.addTaskMember()).then(() => {this.changeSum();});
  }

  fillingMemberData(member: Member) {
    let fg = this.formBuilder.group({
      id: [member.id],
      name: [member.name, Validators.required],
      deposit: [member.deposit, [Validators.required, Validators.min(0)]],
      debt: [member.debt, [Validators.required, Validators.min(0)]],
      taskId: [member.taskId]
    });
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
    var depositInputs = document.getElementsByClassName("deposit");
    var debtsInputs = document.getElementsByClassName("saveDebt");
    if(depositInputs.length==0) return;

    console.log(this.editTaskForm);
    let sumControl = fg.get('sum');
    let sumValue = sumControl.value;

    var sumDeposit = this.CalculateSum(depositInputs, depositInputs.length);
    var sumDebt = this.CalculateSum(debtsInputs, debtsInputs.length);

    console.log('debt '+ sumDebt);
    console.log('deposit '+ sumDeposit);


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

  deleteMember(index: number) {
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
    console.log(formValue);
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
    this.taskService.save(this.task).subscribe();
    this.router.navigate(['tasks']);
  }

  // changeSumAngular(){
  //   var sumInputElem = document.getElementById("Sum");
  //   var sumInput = sumInputElem['value'];
  // }

  //JS OPERATIONS
   changeSum() {
    //value in sum field
    var sumInputElem = document.getElementById("Sum");
    if(sumInputElem===null) return;
    var sumInput = sumInputElem['value'];

    //change first field "deposit"
    var depositInputs = document.getElementsByClassName("deposit");
    if(depositInputs.length===0) return;
    depositInputs[0]['value'] = sumInput;
    this.changeDeposit();

    //get all inputs with manual edit value
    var debtsEditInputs = document.getElementsByClassName("editing");

    if (debtsEditInputs.length != 0) {
      var debtsEditSum = 0;
      //caclulate sum without this fields
      debtsEditSum = this.CalculateSum(debtsEditInputs, debtsEditInputs.length);

      sumInput -= debtsEditSum;

      if (sumInput < 0) {
        sumInputElem.style.color = "red";
        return;
      } else {
        sumInputElem.style.color = "black";
      }
    }

    //get all inputs with "debts"
    var debtsInputs = document.getElementsByClassName("debt");
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
            debtsInputs[iterator]['value'] = (basicValueWithError - 0.01).toFixed(2);
            break;

          case true:
            error = parseFloat((error - 0.01).toFixed(2));
            debtsInputs[iterator]['value'] = (basicValueWithError + 0.01).toFixed(2);
            break;
        }
        iterator++;
      }
    }

    //set value for other inputs, if needed
    while (iterator < debtsLength) {
      debtsInputs[iterator]['value'] = basicValueWithError;
      iterator++;
    }
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
  CalculateSum(inputs, length) {
    var sum = 0;
    for (var iterator = 0; iterator < length; iterator++) {
      sum += parseFloat(inputs[iterator].value);
    }
    return parseFloat(sum.toFixed(0));
  }
}
