import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSharedComponent } from './post-shared.component';

describe('PostSharedComponent', () => {
  let component: PostSharedComponent;
  let fixture: ComponentFixture<PostSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostSharedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
