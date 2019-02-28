import { Component, OnInit } from '@angular/core';
import { DebtsService } from '../../_services';
import { Debt } from '../../_models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-full-info',
  templateUrl: './full-info.component.html',
  styleUrls: ['./full-info.component.css']
})
export class FullInfoComponent implements OnInit {

  debts: Debt[] = [];
  memberNames: string[] = [];

  constructor(private service: DebtsService) { }

  ngOnInit() {
    this.loadDebts();
  }
  loadDebts(): any {
    this.service.fullInfo().pipe(first()).subscribe(debtsResult => {
      this.debts = debtsResult['debts'];
      this.memberNames = debtsResult['memberNames'];
    });
  }

  findValue(m1: string, m2: string) {
    for (let debt of this.debts) {
      if (debt.member1 == m1 && debt.member2 == m2)
        return debt.money;
      if (debt.member1 == m2 && debt.member2 == m1)
        return (debt.money * -1);
    }
    return 0;
  }
}
