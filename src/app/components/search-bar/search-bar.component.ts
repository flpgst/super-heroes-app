import { Component, EventEmitter, model, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  query: string =''
  @Output() onSearchEvent = new EventEmitter<string>();

  onSearch(query: string): void {
    this.onSearchEvent.emit(query);
  }
}
