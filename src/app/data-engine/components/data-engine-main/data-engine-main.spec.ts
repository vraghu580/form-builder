import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEngineMain } from './data-engine-main';

describe('DataEngineMain', () => {
  let component: DataEngineMain;
  let fixture: ComponentFixture<DataEngineMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataEngineMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataEngineMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
