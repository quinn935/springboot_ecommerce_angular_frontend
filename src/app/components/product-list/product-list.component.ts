import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new protities for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;//number of items on each page
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute
              //the current active route that loaded the component, useful for accessing route parameters.
              //Provides access to information about a route associated with a component that is loaded in an outlet.
  ){}

   ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
   }

   //get the product id from route url, then use the id to find the product from the product list
   listProducts(){
      this.searchMode = this.route.snapshot.paramMap.has('keyword');
      // keyword parameter comes from {path: 'search/:keyword', component: ProductListComponent}

      if(this.searchMode){
        this.handleSearchProducts();
      }else{
        this.handleListProducts();
      }

   }


   handleListProducts(){
        //check if 'id' parameter is available
      const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

      if(hasCategoryId){
        //get the 'id' param string, covert string to a number using the '+' symbol
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      }else{
        //not category id available ... default to category id 1
        this.currentCategoryId = 1;
      }

      // check if we have a different category than previous
      // note: Angular will reuse a component if it is currently being viewed

      //if we have a different category id than previous
      //then set thePageNumber back to 1
      if(this.previousCategoryId != this.currentCategoryId){
        this.thePageNumber = 1;
      }

      this.previousCategoryId = this.currentCategoryId;
      console.log(`currentCategoryId = ${this.currentCategoryId}, thePageNumber = ${this.thePageNumber}`);

      this.productService.getProductListPaginate(
        this.thePageNumber-1,
        //pagination in angular: pages are 1 based,
        //pagination in spring data rest: pages are 0 based
        this.thePageSize,
        this.currentCategoryId
      ).subscribe(this.processResult());
   }

   handleSearchProducts(){
       const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
      // if we have a different search keyword than previous
      // then set thePageNumber to 1;
       if(this.previousKeyword!= theKeyword){
          this.thePageNumber = 1;
       }

       this.previousKeyword = theKeyword;
       console.log(`keyword = ${theKeyword}, thePageNumber = ${this.thePageNumber}`);

       this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                                  this.thePageSize,
                                                  theKeyword)
                                                  .subscribe(this.processResult());

   }


   addToCart(theProduct: Product) {
       console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

       const theCartItem = new CartItem(theProduct);

       this.cartService.addToCart(theCartItem);
    }



   updatePageSize(pageSize: string) {
        this.thePageSize = +pageSize;
        this.thePageNumber = 1;
        this.listProducts();
    }

    processResult(){
        return (data: any) => {
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number+1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
        }
    }




}
