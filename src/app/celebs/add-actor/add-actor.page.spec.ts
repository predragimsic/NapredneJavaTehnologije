import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddActorPage } from './add-actor.page';

describe('AddActorPage', () => {
  let component: AddActorPage;
  let fixture: ComponentFixture<AddActorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddActorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
