import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CelebsPage } from './celebs.page';

describe('CelebsPage', () => {
  let component: CelebsPage;
  let fixture: ComponentFixture<CelebsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CelebsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CelebsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
