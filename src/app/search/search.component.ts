import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { search } from '../store/app.actions'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  query = {
    main: ''
  }

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  onQueryChange() {
    this.store.dispatch(search(this.query))
  }
}
