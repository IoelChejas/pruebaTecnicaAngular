import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PokemonService } from 'src/app/services/pokemon.service';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs/internal/Observable';
import { stringify } from '@angular/compiler/src/util';

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

  constructor(private fb: FormBuilder,
    private _pokemonService: PokemonService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private storage: AngularFireStorage) {
    this.crearPokemon = this.fb.group({
      tipo: ["", Validators.required],
      nombre: ["", Validators.required],
      nivel: ["", Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id')
    console.log(this.id)
  }

  uploadPercent: Observable<number>
  urlImage: Observable<string>
  temporalUrlImage: Observable<string>
  file: string

  ngOnInit(): void {
    this.esEditar()
  }
  agregarEditarPokemon() {
    this.submitted = true
    if (this.crearPokemon.invalid) {
      return
    }
    if (this.id === null) {
      this.agregarPokemon()
    } else {
      this.editarEmpleado(this.id)
    }

  }

  agregarPokemon() {
    this.upload()
    const pokemon: any = {
      tipo: this.crearPokemon.value.tipo,
      nombre: this.crearPokemon.value.nombre,
      nivel: this.crearPokemon.value.nivel,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this.loading = true
    this._pokemonService.agregarPokemon(pokemon).then(() => {
      console.log("Pokemon agregado con éxito")
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

  editarEmpleado(id: string) {

    const pokemon: any = {
      tipo: this.crearPokemon.value.tipo,
      nombre: this.crearPokemon.value.nombre,
      nivel: this.crearPokemon.value.nivel,
      fechaActualizacion: new Date()
    }
    this.loading = true
    this._pokemonService.actualizarEmpleado(id, pokemon).then(() => {
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

  esEditar() {
    if (this.id !== null) {
      this.titulo = "Editar pokemon"
      this.loading = true
      this._pokemonService.getPokemon(this.id).subscribe(data => {
        this.loading = false
        console.log(data.payload.data()["tipo"])
        this.crearPokemon.setValue({
          tipo: data.payload.data()["tipo"],
          nombre: data.payload.data()["nombre"],
          nivel: data.payload.data()["nivel"]
        })
      })
    }
  }

  upload() {
    /*if (this.temporalUrlImage) {
      this.storage.storage.refFromURL(stringify(this.temporalUrlImage)).delete
    }*/
    this.uploading = true
    // console.log("subir", e.target.files[0]) 
    const id = Math.random().toString(36).substring(2)
    const file = this.file
    const filePath = `uploads/${id}`
    const ref = this.storage.ref(filePath)
    const task = this.storage.upload(filePath, file)
    this.uploadPercent = task.percentageChanges()
    task.snapshotChanges().pipe(finalize(() => {
      this.urlImage = ref.getDownloadURL()
      this.uploading = false
    }
    )).subscribe()
  }

  onChangeImage(e) {
    /*if (this.temporalUrlImage) {
      console.log(stringify(this.temporalUrlImage))
      this.storage.storage.refFromURL(stringify(this.temporalUrlImage)).delete
    }*/
    this.uploading = true
    // console.log("subir", e.target.files[0]) 
    const id = Math.random().toString(36).substring(2)
    this.file = e.target.files[0]
    const filePath = `temporal/${id}`
    const ref = this.storage.ref(filePath)
    const task = this.storage.upload(filePath, this.file)
    this.uploadPercent = task.percentageChanges()
    task.snapshotChanges().pipe(finalize(() => {
      this.temporalUrlImage = ref.getDownloadURL()
      this.uploading = false
    }
    )).subscribe()
  }
}
