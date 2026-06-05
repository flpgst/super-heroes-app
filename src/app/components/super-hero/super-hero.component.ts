import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Powerstats, SuperHero } from '../../services/super-hero.dto';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-super-hero',
  imports: [RouterLink],
  templateUrl: './super-hero.component.html',
  styleUrl: './super-hero.component.css',
})
export class SuperHeroComponent {
  superHeroId: number | null = null;
  superHero: SuperHero | null = null;
  loading = true;
  error = false;

  readonly statItems: Array<{ key: keyof Powerstats; label: string }> = [
    { key: 'intelligence', label: 'Intelligence' },
    { key: 'strength', label: 'Strength' },
    { key: 'speed', label: 'Speed' },
    { key: 'durability', label: 'Durability' },
    { key: 'power', label: 'Power' },
    { key: 'combat', label: 'Combat' },
  ];

  private activatedRoute = inject(ActivatedRoute);
  private readonly httpService = inject(HttpService);

  constructor() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.superHeroId = slug
        ? parseInt(slug.split('-').at(0) || '', 10)
        : null;
      this.getSuperHero();
    });
  }

  getSuperHero() {
    if (!this.superHeroId) {
      return;
    }

    this.loading = true;
    this.error = false;
    this.httpService.findById(this.superHeroId).subscribe({
      next: (data) => {
        this.superHero = data;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getStatValue(key: keyof Powerstats): number {
    return this.superHero?.powerstats[key] ?? 0;
  }

  getAveragePower(): number {
    if (!this.superHero) {
      return 0;
    }

    const values = this.statItems.map(
      ({ key }) => this.superHero!.powerstats[key],
    );
    return Math.round(
      values.reduce((total, value) => total + value, 0) / values.length,
    );
  }

  getThreatLevel(): string {
    const average = this.getAveragePower();

    if (average >= 80) {
      return 'Extreme';
    }

    if (average >= 60) {
      return 'High';
    }

    if (average >= 40) {
      return 'Moderate';
    }

    return 'Low';
  }

  getAlignmentLabel(): string {
    const alignment = this.superHero?.biography.alignment;

    if (alignment === 'good') {
      return 'Hero';
    }

    if (alignment === 'bad') {
      return 'Villain';
    }

    return 'Neutral';
  }

  getAlignmentClass(): string {
    return this.superHero?.biography.alignment ?? 'neutral';
  }

  getDisplayValue(value: string | string[] | null | undefined): string {
    if (Array.isArray(value)) {
      return value.filter(Boolean).join(' / ') || 'Unknown';
    }

    if (!value || value === '-' || value.trim() === '') {
      return 'Unknown';
    }

    return value;
  }

  getRadarPoints(): string {
    const center = 50;
    const radius = 38;
    const angleStep = (Math.PI * 2) / this.statItems.length;

    return this.statItems
      .map(({ key }, index) => {
        const valueRadius = (this.getStatValue(key) / 100) * radius;
        const angle = -Math.PI / 2 + index * angleStep;
        const x = center + Math.cos(angle) * valueRadius;
        const y = center + Math.sin(angle) * valueRadius;

        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }
}
