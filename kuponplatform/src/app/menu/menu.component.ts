import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuItemsToAdd:{name:string, desc:string, price:number, editing:boolean}[] = [];
  item:any= {name: '', desc: '', price: null, editing: false}
  constructor() { }

  ngOnInit(): void {
  }

  addMenuItem() {
    this.menuItemsToAdd.push(this.item);
    this.item = {name: '', desc: '', price: null, editing: false}
  }

  deleteMenuItem(i:number){
    this.menuItemsToAdd.splice(i, 1)
  }

  editMenuItem(item:any) {
    item.editing = true;
  }

  saveMenuItem(item:any) {
    item.editing = false;
  }

  uploadMenu(){
    console.log('Ok')
  }

}

