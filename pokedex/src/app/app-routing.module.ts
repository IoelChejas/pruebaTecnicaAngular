import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearPokemonComponent } from './components/crear-pokemon/crear-pokemon.component';
import { EditarPokemonComponent } from './components/editar-pokemon/editar-pokemon.component';
import { ListaPokemonesComponent } from './components/lista-pokemones/lista-pokemones.component';

const routes: Routes = [
  { path: '', redirectTo: 'lista-pokemones', pathMatch: 'full' },
  { path: 'lista-pokemones', component: ListaPokemonesComponent },
  { path: 'crear-pokemon', component: CrearPokemonComponent },
  { path: 'editar-pokemon/:id', component: EditarPokemonComponent },
  { path: '**', redirectTo: 'lista-pokemones', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
