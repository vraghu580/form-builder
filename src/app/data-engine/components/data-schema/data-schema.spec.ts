import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSchema } from './data-schema';

describe('DataSchema', () => {
  let component: DataSchema;
  let fixture: ComponentFixture<DataSchema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataSchema]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSchema);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
