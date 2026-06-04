import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { SuperHero } from '../../services/super-hero.dto';
import { ColorService, CssNamedColor } from '../../services/color.service';
import { NgStyle } from '@angular/common';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { LoadingBarComponent } from '../loading-bar/loading-bar.component';

@Component({
  selector: 'app-content',
  imports: [NgStyle, SearchBarComponent, LoadingBarComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {
  private readonly httpService = inject(HttpService);
  private readonly colorService = inject(ColorService);

  superHeroes: SuperHero[] = [];
  backgroundColors: CssNamedColor[] = [];
  loading = true;

  onSearch(query: string): void {
    this.loading = true;
    this.httpService.findByName(query).subscribe({
      next: (data) => {
        this.superHeroes = data;
        this.superHeroes.forEach(({ id }) => {
          this.backgroundColors[id] = this.colorService.getRandomColor();
        });
      },
      error: (err) => {
        console.error('Error fetching heroes:', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.httpService.findAll().subscribe({
      next: (data) => {
        this.superHeroes = data;
        this.superHeroes.forEach(({ id }) => {
          this.backgroundColors[id] = this.colorService.getRandomColor();
        });
      },
      error: (err) => {
        console.error('Error fetching heroes:', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
