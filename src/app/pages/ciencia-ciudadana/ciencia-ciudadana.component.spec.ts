import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CienciaCiudadanaComponent } from './ciencia-ciudadana.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CienciaCiudadanaComponent', () => {
  let component: CienciaCiudadanaComponent;
  let fixture: ComponentFixture<CienciaCiudadanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CienciaCiudadanaComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CienciaCiudadanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });
});
