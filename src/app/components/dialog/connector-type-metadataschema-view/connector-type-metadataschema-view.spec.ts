import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorTypeMetadataschemaView } from './connector-type-metadataschema-view';

describe('ConnectorTypeMetadataschemaView', () => {
  let component: ConnectorTypeMetadataschemaView;
  let fixture: ComponentFixture<ConnectorTypeMetadataschemaView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectorTypeMetadataschemaView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectorTypeMetadataschemaView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
