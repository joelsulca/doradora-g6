import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosdetalleComponent } from './productosdetalle.component';

describe('ProductosdetalleComponent', () => {
  let component: ProductosdetalleComponent;
  let fixture: ComponentFixture<ProductosdetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosdetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosdetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
