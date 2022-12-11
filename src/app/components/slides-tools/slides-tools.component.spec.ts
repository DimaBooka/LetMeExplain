import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidesToolsComponent } from './slides-tools.component';

describe('SlidesToolsComponent', () => {
  let component: SlidesToolsComponent;
  let fixture: ComponentFixture<SlidesToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlidesToolsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlidesToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
