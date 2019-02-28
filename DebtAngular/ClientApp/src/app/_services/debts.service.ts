import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Debt } from './../_models';


@Injectable({
  providedIn: 'root'
})
export class DebtsService {

  constructor(private http: HttpClient) { }

  getAll(memberId: string) {
    const params = new HttpParams().set('memberId', memberId);
    return this.http.get<Debt[]>(`${environment.apiUrl}/debts`,{params});
  }

  fullInfo() {
    return this.http.get<Debt[]>(`${environment.apiUrl}/debts/info`);
  }
}
