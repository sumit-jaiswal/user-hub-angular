import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingService } from '../../services/loading.service';
import { LoadingComponent } from './loading.component';
import { MaterialModule } from '../../material.module';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loader: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [LoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    loader = TestBed.inject(LoadingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loader', () => {
    const fixture = TestBed.createComponent(LoadingComponent);
    loader.loadingOn();
    fixture.detectChanges();
    const progressBarElement =
      fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBarElement).toBeTruthy();
  });

  it('should hide display loader', () => {
    const fixture = TestBed.createComponent(LoadingComponent);
    loader.loadingOff();
    fixture.detectChanges();
    const progressBarElement =
      fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBarElement).toBeFalsy();
  });
});
