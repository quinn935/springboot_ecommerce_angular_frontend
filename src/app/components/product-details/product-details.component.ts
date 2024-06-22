import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{

    product!: Product;

    constructor(private productService: ProductService,
                private route: ActivatedRoute,
                private cartService: CartService
    ){}

    ngOnInit(): void {
      // when we have to use route parameter in handleProductDetails function,
      //we use route.paramMap.subscribe to wrap the function call;
      this.route.paramMap.subscribe(()=>{
        this.handleProductDetails();
      })
    }

    handleProductDetails() {

      //GET THE product id FROM THE ROUTE URL FROM routerLink in product-list-grid.component.html
      const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

      this.productService.getProduct(theProductId).subscribe(
        data => {
          this.product = data;
        }
      )

    }

    addToCart() {
         const theCartItem = new CartItem(this.product);
         this.cartService.addToCart(theCartItem);
      }

}
