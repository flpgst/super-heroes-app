import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SuperHero } from '../../services/super-hero.dto';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-super-hero',
  imports: [],
  templateUrl: './super-hero.component.html',
  styleUrl: './super-hero.component.css',
})
export class SuperHeroComponent {
  superHeroId: number | null = null;
  superHero: SuperHero | null = null;
  private activatedRoute = inject(ActivatedRoute);
  private readonly httpService = inject(HttpService);

  constructor() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.superHeroId = slug ? parseInt(slug.split('-').at(0) || '', 10) : null;
      this.getSuperHero();
    });
  }

  getSuperHero() {
    if (!this.superHeroId) {
      return;
    }

    this.httpService.findById(this.superHeroId).subscribe({
      next: (data) => {
        this.superHero = data;
      },
    });
  }
}
