import {Component, inject, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';

import {NgIf, NgFor, CurrencyPipe} from '@angular/common';
import {Product} from '../product';
import {ProductService} from "../product.service";
import {Subscription, tap} from "rxjs";

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy {
  // Just enough here for the template to compile
  @Input() productId: number = 0;
  errorMessage = '';

  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
  private productService: ProductService = inject(ProductService);
  private productSub!: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    const id = changes['productId'].currentValue;
    if (id) {
      this.productId = id;
      this.productSub = this.productService.getProductById(id)
        .pipe(tap(() => console.log("In tap product detail sub pipeline")))
        .subscribe(product => this.product = product);
    }
  }

  ngOnDestroy(): void {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
  }

  addToCart(product: Product) {
  }
}
