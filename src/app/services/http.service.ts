import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuperHero } from './super-hero.dto';

type ImageSize = 'xs' | 'sm' | 'md' | 'lg';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://akabab.github.io/superhero-api/api';
  private readonly imagesBaseUrl =
    'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images';

  findAll(): Observable<SuperHero[]> {
    return this.http.get<SuperHero[]>(`${this.baseUrl}/all.json`);
  }

  findById(id: number | null): Observable<SuperHero> {
    if (!id) {
      throw new Error('Invalid id');
    }
    return this.http.get<SuperHero>(`${this.baseUrl}/id/${id}.json`);
  }

  findByName(name: string): Observable<SuperHero[]> {
    const superHeroes = this.findAll();
    return new Observable<SuperHero[]>((subscriber) => {
      superHeroes.subscribe({
        next: (heroes) => {
          const filteredHeroes = heroes.filter((hero) =>
            hero.name.toLowerCase().includes(name.toLowerCase()),
          );
          subscriber.next(filteredHeroes);
          subscriber.complete();
        },
        error: (err) => subscriber.error(err),
      });
    });
  }

  findPowerStatsById(id: number): Observable<SuperHero['powerstats']> {
    return this.http.get<SuperHero['powerstats']>(
      `${this.baseUrl}/id/${id}.json`,
    );
  }

  findAppearanceById(id: number): Observable<SuperHero['appearance']> {
    return this.http.get<SuperHero['appearance']>(
      `${this.baseUrl}/id/${id}.json`,
    );
  }

  findBiographyById(id: number): Observable<SuperHero['biography']> {
    return this.http.get<SuperHero['biography']>(
      `${this.baseUrl}/id/${id}.json`,
    );
  }

  findWorkById(id: number): Observable<SuperHero['work']> {
    return this.http.get<SuperHero['work']>(`${this.baseUrl}/id/${id}.json`);
  }

  findConnectionsById(id: number): Observable<SuperHero['connections']> {
    return this.http.get<SuperHero['connections']>(
      `${this.baseUrl}/id/${id}.json`,
    );
  }

  findImageURLBySlug(slug: string, size: ImageSize): Observable<string> {
    return new Observable<string>((subscriber) => {
      subscriber.next(`${this.imagesBaseUrl}/${size}/${slug}.jpg`);
      subscriber.complete();
    });
  }
}
