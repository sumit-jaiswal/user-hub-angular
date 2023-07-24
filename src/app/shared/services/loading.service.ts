import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {}
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
