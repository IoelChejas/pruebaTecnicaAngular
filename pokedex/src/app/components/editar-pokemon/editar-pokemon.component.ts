import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PokemonService } from 'src/app/services/pokemon.service';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-editar-pokemon',
  templateUrl: './editar-pokemon.component.html',
  styleUrls: ['./editar-pokemon.component.css']
})
export class EditarPokemonComponent implements OnInit {

  editarPokemon: FormGroup
  submitted = false
  loading = false
  id: string | null
  titulo = "Editar pokemon"
  uploading = false

  tipos = []
  habilidades = []

  constructor(private fb: FormBuilder,
    private _pokemonService: PokemonService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private storage: AngularFireStorage) {
    this.editarPokemon = this.fb.group({
      tipo: [[]],
      nombre: ["", Validators.required],
      nivel: ["", Validators.required],
      habilidad: [[]]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id')
  }

  uploadPercent: Observable<number>
  file: string
  url: string
  urlT: string
  urlImagenAMostrar: string

  ngOnInit(): void {
    this.urlImagenAMostrar = "/assets/imagen_pokemon_defecto.jpg"
    this.loading = true
    this._pokemonService.getPokemon(this.id).subscribe(data => {
      this.loading = false
      this.editarPokemon.setValue({
        tipo: "",
        nombre: data.payload.data()["nombre"],
        nivel: data.payload.data()["nivel"],
        habilidad: ""
      })
      this.tipos = data.payload.data()["tipo"]//.split([","])
      this.urlImagenAMostrar = data.payload.data()["urlImagen"]
      this.url = data.payload.data()["urlImagen"]
      this.habilidades = data.payload.data()["habilidad"]
    })
  }

  editPokemon() {
    if (this.urlT) {
      this.editImage()
    }
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
    const pokemon: any = {
      tipo: this.tipos,
      nombre: this.editarPokemon.value.nombre,
      nivel: this.editarPokemon.value.nivel,
      urlImagen: this.url,
      habilidad: this.habilidades
    }
    this.loading = true
    this._pokemonService.actualizarPokemon(this.id, pokemon).then(() => {
      this.loading = false
      this.toastr.info('El pokemon fue modificado con éxito', 'Pokemon modificado', {
        positionClass: "toast-bottom-right"
      });
      this.router.navigate(['/lista-pokemones'])
    }).catch(error => {
      console.log(error)
      this.loading = false
    })
  }

  editImage() {
    this.storage.storage.refFromURL(this.url).delete()
    this.url = this.urlT
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
        this.urlImagenAMostrar = urlImage
      })
      this.uploading = false
    }
    )).subscribe()
  }

  agregarTipo() {
    if (this.editarPokemon.value.tipo.split("").length > 0) {
      this.tipos.push(this.editarPokemon.value.tipo)
    }
  }

  eliminarTipo(tipo) {
    var indice = this.tipos.indexOf(tipo)
    this.tipos.splice(indice, 1)
  }

  agregarHabilidad() {
    if (this.editarPokemon.value.habilidad.split("").length > 0) {
      this.habilidades.push(this.editarPokemon.value.habilidad)
    }
  }

  eliminarHabilidad(habilidad) {
    var indice = this.habilidades.indexOf(habilidad)
    this.habilidades.splice(indice, 1)
  }
}
