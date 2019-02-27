import { NgModule, Component, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


@Component({
  selector: 'app-com1',
  templateUrl: './component1.component.html'
})
export class Component1Component implements OnInit {
  ngOnInit() {
    console.log('com1');
  }
}
