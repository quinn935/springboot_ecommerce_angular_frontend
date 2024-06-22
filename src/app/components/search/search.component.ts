import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
    constructor(private router: Router){}

    ngOnInit() {

    }

    doSearch(value: string){
       this.router.navigateByUrl(`/search/${value}`);
      //  Route the data to our 'search' route
      // It will be handled by the ProductListComponent
    }
}
