import { Injectable } from '@angular/core';
import {BehaviorSubject, debounceTime, distinctUntilChanged, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  readonly filterSubject = new BehaviorSubject<string>('');
  readonly filter$: Observable<string> = this.filterSubject.asObservable();

  doFilter(event: Event): void {
    const element = event.target as HTMLInputElement,
      value = element.value.trim().toLocaleLowerCase();

    this.filterSubject.next(value);
  }
}