import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { OrderItem } from 'src/app/shared/order-item.model';
import { ItemService } from 'src/app/shared/item.service';
import { Item } from 'src/app/shared/item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';


@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styles: []
})
export class OrderItemsComponent implements OnInit {

  formData: OrderItem;
  ItemList: Item[];
  IsValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogref : MatDialogRef<OrderItemsComponent>,
    private Itemservice : ItemService,
    private orderService : OrderService) { }

  ngOnInit() {
    this.Itemservice.getItemList().then(res => this.ItemList = res as Item[] );
    if(this.data.OrderItemIndex == null)
    this.formData = {
      OrderItem_ID : null,
      Order_ID : this.data.OrderID,
      Item_ID : 0,
      ItemName : '',
      Price : 0,
      Quantity : 0,
      Total : 0
    }
    else
    this.formData = Object.assign({},this.orderService.orderItems[this.data.OrderItemIndex]);
  }
  updatePrice(ctrl){
      if(ctrl.selectedIndex==0){
        this.formData.Price=0;
        this.formData.ItemName='';
      }
      else{
        this.formData.Price = this.ItemList[ctrl.selectedIndex-1].Price;
        this.formData.ItemName = this.ItemList[ctrl.selectedIndex-1].Name;
      }
      this.UpdateTotal();
  }
  UpdateTotal(){
    this.formData.Total= parseFloat((this.formData.Quantity * this.formData.Price).toFixed(2));
  }
  onSubmit(form:NgForm){
    if(this.validateForm(form.value)) {
      if(this.data.OrderItemIndex == null )
        this.orderService.orderItems.push(form.value);
      else
      this.orderService.orderItems[this.data.OrderItemIndex] = form.value;
        this.dialogref.close();
   }
  }

  validateForm(formData:OrderItem){
    this.IsValid= true;
    if(formData.Item_ID==0) {
      this.IsValid =false;
    }
    else if(formData.Quantity==0){
      this.IsValid =false;
    }
    return this.IsValid;

  }

}
