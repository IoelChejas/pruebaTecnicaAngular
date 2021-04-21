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

  constructor(private fb: FormBuilder,
    private _pokemonService: PokemonService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private storage: AngularFireStorage) {
    this.editarPokemon = this.fb.group({
      tipo: [[], Validators.required],
      nombre: ["", Validators.required],
      nivel: ["", Validators.required]
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
      console.log(data.payload.data()["tipo"])
      this.editarPokemon.setValue({
        tipo: data.payload.data()["tipo"],
        nombre: data.payload.data()["nombre"],
        nivel: data.payload.data()["nivel"]
      })
      this.urlImagenAMostrar = data.payload.data()["urlImagen"]
      this.url = data.payload.data()["urlImagen"]
    })
  }

  editPokemon() {
    if (this.urlT) {
      this.editImage()
    }
    const pokemon: any = {
      tipo: this.editarPokemon.value.tipo,
      nombre: this.editarPokemon.value.nombre,
      nivel: this.editarPokemon.value.nivel,
      urlImagen: this.url
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

}
