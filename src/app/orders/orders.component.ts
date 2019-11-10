import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {

  orderList;

  constructor(private servie : OrderService, private router: Router,
    private tostr: ToastrService) { }

  ngOnInit() {
    this.refreshList();
  }
  refreshList(){
    this.servie.getOrderList().then(res => this.orderList = res);
  }
  openForEdit(orderId: number) {
    this.router.navigate(['/order/edit/' + orderId]);
  }
  onItemDelete(id: number) {
    if(confirm('Are you sure to Delete this Record ?')){
    this.servie.deleteOrder(id).then(res => {
    this.refreshList();
    this.tostr.warning("Order Deleted Successfully","Resturant App");
  });
  }
  }

}
