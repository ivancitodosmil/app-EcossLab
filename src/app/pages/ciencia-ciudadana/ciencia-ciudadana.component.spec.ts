import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CienciaCiudadanaComponent } from './ciencia-ciudadana.component';

describe('CienciaCiudadanaComponent', () => {
  let component: CienciaCiudadanaComponent;
  let fixture: ComponentFixture<CienciaCiudadanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CienciaCiudadanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CienciaCiudadanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
