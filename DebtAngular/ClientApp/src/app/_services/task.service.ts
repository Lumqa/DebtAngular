import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

import { Task } from './../_models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Task[]>(`${environment.apiUrl}/tasks`);
  }
  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/tasks/${id}`);
  }
  save(task: Task) {
    return this.http.post(`${environment.apiUrl}/tasks/`, task);
  }
  getAddOrEditTask(taskId:string) {
    return this.http.get<Task>(`${environment.apiUrl}/tasks/addoredittask/`+((taskId===undefined)? ' ':taskId));
  }
}
