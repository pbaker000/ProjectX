import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDialog } from './alert-dialog.component';

describe('AlertDialog', () => {
  let component: AlertDialog;
  let fixture: ComponentFixture<AlertDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
