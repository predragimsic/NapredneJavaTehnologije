import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActorModalComponent } from './actor-modal.component';

describe('ActorModalComponent', () => {
  let component: ActorModalComponent;
  let fixture: ComponentFixture<ActorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActorModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
