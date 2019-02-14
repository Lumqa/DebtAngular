import { Debt } from './debt';
import { Member } from "./member";

export class Task {
    id: string;
    name: string;
    sum: number;
    userId: string;
    members: Member[] = [];
    debts: Debt[] = [];
}
