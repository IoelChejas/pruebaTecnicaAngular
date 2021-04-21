import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PokemonService } from 'src/app/services/pokemon.service';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-crear-pokemon',
  templateUrl: './crear-pokemon.component.html',
  styleUrls: ['./crear-pokemon.component.css']
})
export class CrearPokemonComponent implements OnInit {
  crearPokemon: FormGroup
  submitted = false
  loading = false
  id: string | null
  titulo = "Agregar pokemon"
  uploading = false

  tipos = []
  habilidades = []

  constructor(private fb: FormBuilder,
    private _pokemonService: PokemonService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private storage: AngularFireStorage) {
    this.crearPokemon = this.fb.group({
      tipo: [[]],
      nombre: ["", Validators.required],
      nivel: ["", Validators.required],
      imagen: ["", Validators.required],
      habilidad: [[]]
    })
  }

  uploadPercent: Observable<number>
  file: string
  url: string
  urlT: string

  ngOnInit(): void {
  }

  agregarPokemon() {
    this.submitted = true
    if (this.tipos.length == 0) {
      this.toastr.error('Falta agregar tipos al pokemon', 'Faltan tipos', {
        positionClass: "toast-bottom-right"
      });
      return
    }
    if (this.habilidades.length == 0) {
      this.toastr.error('Falta agregar habilidades al pokemon', 'Faltan habilidades', {
        positionClass: "toast-bottom-right"
      });
      return
    }
    if (this.crearPokemon.invalid) {
      return
    }
    const pokemon: any = {
      tipo: this.tipos,
      nombre: this.crearPokemon.value.nombre,
      nivel: this.crearPokemon.value.nivel,
      urlImagen: this.url,
      habilidad: this.habilidades
    }
    this.loading = true
    this._pokemonService.agregarPokemon(pokemon).then(() => {
      this.toastr.success('El pokemon fue agregado con éxito', 'Pokemon agregado', {
        positionClass: "toast-bottom-right"
      });
      this.loading = false
      this.router.navigate(['/lista-pokemones'])
    }).catch(error => {
      console.log(error)
      this.loading = false
    }
    );
  }

  onChangeImage(e) {
    if (this.urlT) {
      this.storage.storage.refFromURL(this.urlT).delete()
    }
    this.uploading = true
    const id = Math.random().toString(36).substring(2)
    this.file = e.target.files[0]
    const filePath = `uploads/${id}`
    const ref = this.storage.ref(filePath)
    const task = this.storage.upload(filePath, this.file)
    this.uploadPercent = task.percentageChanges()
    task.snapshotChanges().pipe(finalize(() => {
      ref.getDownloadURL().subscribe(urlImage => {
        this.urlT = urlImage
        this.url = urlImage
      })
    }
    )).subscribe()
  }

  agregarTipo() {
    if (this.crearPokemon.value.tipo.split("").length > 0) {
      this.tipos.push(this.crearPokemon.value.tipo)
    }
  }

  eliminarTipo(tipo) {
    var indice = this.tipos.indexOf(tipo)
    this.tipos.splice(indice, 1)
  }

  agregarHabilidad() {
    if (this.crearPokemon.value.habilidad.split("").length > 0) {
      this.habilidades.push(this.crearPokemon.value.habilidad)
    }
  }

  eliminarHabilidad(habilidad) {
    var indice = this.habilidades.indexOf(habilidad)
    this.habilidades.splice(indice, 1)
  }
}



