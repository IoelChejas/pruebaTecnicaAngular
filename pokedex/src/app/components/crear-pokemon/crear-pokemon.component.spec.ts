import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPokemonComponent } from './crear-pokemon.component';

describe('CrearPokemonComponent', () => {
  let component: CrearPokemonComponent;
  let fixture: ComponentFixture<CrearPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearPokemonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
