import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopularActorsPage } from './popular-actors.page';

describe('PopularActorsPage', () => {
  let component: PopularActorsPage;
  let fixture: ComponentFixture<PopularActorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularActorsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopularActorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
