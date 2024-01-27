import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOperationComponent } from './show-operation.component';

describe('ShowOperationComponent', () => {
  let component: ShowOperationComponent;
  let fixture: ComponentFixture<ShowOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowOperationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
