/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddOrEditTasksComponent } from './addOrEditTasks.component';

describe('AddOrEditTasksComponent', () => {
  let component: AddOrEditTasksComponent;
  let fixture: ComponentFixture<AddOrEditTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrEditTasksComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
