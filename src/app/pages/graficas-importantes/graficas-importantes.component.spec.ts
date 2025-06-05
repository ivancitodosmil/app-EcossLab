import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficasImportantesComponent } from './graficas-importantes.component';

describe('GraficasImportantesComponent', () => {
  let component: GraficasImportantesComponent;
  let fixture: ComponentFixture<GraficasImportantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficasImportantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficasImportantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
