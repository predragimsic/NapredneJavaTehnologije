import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchActorsPage } from './search-actors.page';

describe('SearchActorsPage', () => {
  let component: SearchActorsPage;
  let fixture: ComponentFixture<SearchActorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchActorsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchActorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
