import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopularMoviesPage } from './popular-movies.page';

describe('PopularMoviesPage', () => {
  let component: PopularMoviesPage;
  let fixture: ComponentFixture<PopularMoviesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularMoviesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopularMoviesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
