import { Component, inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { SuperHero } from '../../services/super-hero.dto';
import { ColorService, CssNamedColor } from '../../services/color.service';
import { NgStyle } from "@angular/common";
import { SearchBarComponent } from "../search-bar/search-bar.component";

@Component({
  selector: 'app-content',
  imports: [NgStyle, SearchBarComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  private readonly httpService = inject(HttpService);
  superHeroes: SuperHero[] = [];
  backgroundColors: CssNamedColor[] = [];

  private readonly colorService = inject(ColorService);

onSearch(query: string): void {
  this.httpService.findByName(query).subscribe({
    next: (data) => {
      this.superHeroes = data;
      this.superHeroes.forEach(({id}) => {
        this.backgroundColors[id] = this.colorService.getRandomColor();
      });
    },
    error: (err) => {
      console.error('Error fetching heroes:', err);
    }
  });
}

  ngOnInit(): void {
    this.httpService.findAll().subscribe({
      next: (data) => {
        this.superHeroes = data;
        this.superHeroes.forEach(({id}) => {
          this.backgroundColors[id] = this.colorService.getRandomColor();
        });
      },
      error: (err) => {
        console.error('Error fetching heroes:', err);
      }
    });
  }


}
