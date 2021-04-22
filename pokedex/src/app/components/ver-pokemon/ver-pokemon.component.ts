import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-ver-pokemon',
  templateUrl: './ver-pokemon.component.html',
  styleUrls: ['./ver-pokemon.component.css']
})
export class VerPokemonComponent implements OnInit {

  verPokemon: FormGroup
  id: string | null
  titulo = "Ver pokemon"

  tipos = []
  habilidades = []

  evoluciones = []

  tiposDeEvolucion = []

  constructor(private fb: FormBuilder,
    private _pokemonService: PokemonService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private storage: AngularFireStorage) {
    this.verPokemon = this.fb.group({
      tipo: [[]],
      nombre: [""],
      nivel: [""],
      habilidad: [[]],
      tipoEvolucion: [[]],
      nivelEvolucion: [""],
      nombreEvolucion: [""]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id')
  }

  urlImagenAMostrar: string

  ngOnInit(): void {
    this.urlImagenAMostrar = "/assets/imagen_pokemon_defecto.jpg"
    this._pokemonService.getPokemon(this.id).subscribe(data => {
      this.tipos = data.payload.data()["tipo"]
      this.urlImagenAMostrar = data.payload.data()["urlImagen"]
      this.habilidades = data.payload.data()["habilidad"],
        this.evoluciones = data.payload.data()["evoluciones"]
      this.verPokemon.setValue({
        tipo: "",
        nombre: data.payload.data()["nombre"],
        nivel: data.payload.data()["nivel"],
        habilidad: "",
        tipoEvolucion: "",
        nombreEvolucion: "",
        nivelEvolucion: ""
      })
    })
  }
}
