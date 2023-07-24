import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

/**
 * LoadingComponent
 *
 * This component represents a loading spinner or progress indicator that is displayed
 * during asynchronous operations or when the application is waiting for data to load.
 * The component uses the 'LoadingService' to track the loading state of the application.
 * By subscribing to the 'loading$' observable of the 'LoadingService', the component
 * automatically updates its visibility based on changes in the loading state.
 * When the 'loading$' observable emits 'true', the loading spinner is shown, and when it
 * emits 'false', the spinner is hidden. The component template displays a material design
 * progress bar ('mat-progress-bar') in case of loading, and it is hidden otherwise.
 */
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
