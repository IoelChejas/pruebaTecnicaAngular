import { NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { CrearPokemonComponent } from './components/crear-pokemon/crear-pokemon.component';
import { EditarPokemonComponent } from './components/editar-pokemon/editar-pokemon.component';
import { ListaPokemonesComponent } from './components/lista-pokemones/lista-pokemones.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegistrarseComponent } from './components/registrarse/registrarse.component';
import { VerPokemonComponent } from './components/ver-pokemon/ver-pokemon.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'lista-pokemones', component: ListaPokemonesComponent, canActivate: [AngularFireAuthGuard] },
  { path: 'crear-pokemon', component: CrearPokemonComponent, canActivate: [AngularFireAuthGuard] },
  { path: 'editar-pokemon/:id', component: EditarPokemonComponent, canActivate: [AngularFireAuthGuard] },
  { path: 'ver-pokemon/:id', component: VerPokemonComponent, canActivate: [AngularFireAuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'registrarse', component: RegistrarseComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [AngularFireAuthGuard] },
  { path: '**', redirectTo: 'lista-pokemones', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
