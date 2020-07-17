import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActorElementComponent } from './actor-element.component';

describe('ActorElementComponent', () => {
  let component: ActorElementComponent;
  let fixture: ComponentFixture<ActorElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActorElementComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActorElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
