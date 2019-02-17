import { Debt } from './debt';
import { Member } from "./member";

export class Task {
    id: string;
    name: string;
    sum: number;
    userId: string;
    members: Member[] = [];
    debts: Debt[] = [];
    constructor() {
    this.id = '00000000-0000-0000-0000-000000000000';
  }

}
