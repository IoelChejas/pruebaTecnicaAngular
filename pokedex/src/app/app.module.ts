import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Modulos
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireStorageModule } from '@angular/fire/storage'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { FormsModule } from '@angular/forms'

// Componentes
import { AppComponent } from './app.component';
import { ListaPokemonesComponent } from './components/lista-pokemones/lista-pokemones.component';
import { CrearPokemonComponent } from './components/crear-pokemon/crear-pokemon.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { environment } from 'src/environments/environment';
import { EditarPokemonComponent } from './components/editar-pokemon/editar-pokemon.component';
import { VerPokemonComponent } from './components/ver-pokemon/ver-pokemon.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrarseComponent } from './components/registrarse/registrarse.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { FormComponent } from './components/form/form.component';
import { AngularFireAuthGuardModule  } from '@angular/fire/auth-guard'

@NgModule({
  declarations: [
    AppComponent,
    ListaPokemonesComponent,
    CrearPokemonComponent,
    NavbarComponent,
    EditarPokemonComponent,
    VerPokemonComponent,
    LoginComponent,
    RegistrarseComponent,
    PerfilComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    FormsModule,
    AngularFireAuthGuardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
