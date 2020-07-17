import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchMoviesPage } from './search-movies.page';

describe('SearchMoviesPage', () => {
  let component: SearchMoviesPage;
  let fixture: ComponentFixture<SearchMoviesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMoviesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchMoviesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
