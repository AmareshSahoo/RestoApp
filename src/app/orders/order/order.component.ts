import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { NgForm, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { formatPercent } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { CustomerService } from 'src/app/shared/customer.service';
import { Customer } from 'src/app/shared/customer.model';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit {

  registerrForm: FormGroup;
  customerlist: Customer[];
  IsValid: boolean = true;

  constructor(public service: OrderService,
    private dialoge: MatDialog,
    private customerservice : CustomerService, private toastr: ToastrService,
    private route: Router,
    private currentRoute: ActivatedRoute,
    private  _fb: FormBuilder
    ) { }

  ngOnInit() {
    this.registerrForm = this._fb.group({
      // Customer_ID : [null],
      Name : ['', Validators.required]
    });

    const orderID = this.currentRoute.snapshot.paramMap.get('id');
    if ( orderID == null ) {
    this.resetform();
    } else {
      this.service.getOrderByID(parseInt(orderID)).then( res => {
        this.service.formData = res.order;
        this.service.orderItems = res.orderDetails;

      });
    }
    this.getAllCustomerList();
  }

  resetform(form?: NgForm) {
    if( form = null ) {
    form.resetForm();
    }
    this.service.formData = {
      Order_ID: null,
      Order_No: Math.floor(100000 + Math.random() * 900000).toString(),
      Customer_ID: null,
      P_Method: '',
      G_Total: 0,
      DeletedOrderItemIDs : ''
    };
    this.service.orderItems = [];
  }
  getAllCustomerList() {
    this.customerservice.getCustomerList().then(res => this.customerlist = res as Customer[] );
  }

  AddOrEditOrderItem(OrderItemIndex, OrderID) {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    dialogconfig.width = '50%';
    dialogconfig.data = { OrderItemIndex, OrderID };
    this.dialoge.open(OrderItemsComponent, dialogconfig).afterClosed().subscribe(res => {
      this.UpdateGrandTotal();
    });
  }
  onDeleteOrderItem(OrderItem_ID : number, i: number) {
    if (OrderItem_ID != null) {
    this.service.formData.DeletedOrderItemIDs += OrderItem_ID + ",";
    }
    this.service.orderItems.splice(i, 1);
    this.UpdateGrandTotal();
  }

  UpdateGrandTotal() {
  this.service.formData.G_Total =  this.service.orderItems.reduce((prev, curr) => {
      return prev + curr.Total;
    }, 0);
  this.service.formData.G_Total = parseFloat((this.service.formData.G_Total.toFixed(2)));
  }

  ValidateForm() {
    this.IsValid = true;
    if (this.service.formData.Customer_ID === 0) {
      this.IsValid = false;
    } else if (this.service.orderItems.length === 0) {
      this.IsValid = false;
    }
    return this.IsValid;
  }
  onSubmit(form: NgForm) {
    if (this.ValidateForm()) {
      {
        this.service.saveOrUpdateOrder().subscribe(res => {
          this.resetform();
          this.toastr.success(' Order Placed Successfully', 'Resturant App.') ;
          this.route.navigate(['/orders']);
        });
      }
    }
  }

  CreateCus(data) {
    console.log(data);
    this.customerservice.CreateCustomer(data).subscribe(res => {
      this.registerrForm.reset();
      this.getAllCustomerList();
      $('#aaa').trigger('click');
      this.toastr.success(' New Customer Added Successfully', 'Resturant App.') ;
    });
  }

}
