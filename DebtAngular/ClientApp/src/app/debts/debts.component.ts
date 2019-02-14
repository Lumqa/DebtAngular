import { DebtsService } from './../_services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Debt } from '@app/_models';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.css']
})
export class DebtsComponent implements OnInit {
  memberId: string;
  memberName:string;
  debts:Debt[]=[];
  constructor(private debtsService: DebtsService, private activateRoute: ActivatedRoute) {
    this.memberId = activateRoute.snapshot.queryParams['memberId'];
  }

  ngOnInit() {
    this.loadDebts();
  }
  loadDebts(): any {
    this.debtsService.getAll(this.memberId).pipe(first()).subscribe(debtsResult => {
      this.debts = debtsResult['debts'];
      this.memberName = debtsResult['name'];
      console.log(this.debts);
    });
  }

}
