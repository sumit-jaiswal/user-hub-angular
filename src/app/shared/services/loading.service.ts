import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { concatMap, finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {}
  /**
   *
   * @param obs$ passed any Obsrable
   * @returns same obs$
   * Methode use to manage loader on API call
   */
  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.loadingOn()),
      concatMap(() => obs$),
      finalize(() => this.loadingOff())
    );
  }
  /**
   * loadingOn method will use for emit loader ON
   */
  loadingOn() {
    this.loadingSubject.next(true);
  }
  /**
   * loadingOff method will use for emit loader OFF
   */
  loadingOff() {
    this.loadingSubject.next(false);
  }
}
