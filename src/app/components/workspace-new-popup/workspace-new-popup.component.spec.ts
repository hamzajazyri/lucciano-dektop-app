import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceNewPopupComponent } from './workspace-new-popup.component';

describe('WorkspaceNewPopupComponent', () => {
  let component: WorkspaceNewPopupComponent;
  let fixture: ComponentFixture<WorkspaceNewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceNewPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceNewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
