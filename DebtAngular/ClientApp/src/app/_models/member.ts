import { DoBootstrap } from "@angular/core";

export class Member {
    id:string
    name:string;
    deposit:number;
    debt:number;
    taskId:string;
    constructor(taskId:string){
        this.id ='00000000-0000-0000-0000-000000000000';
        this.name='';
        this.deposit=0;
        this.debt=0;
        this.taskId = taskId;
    }
}

