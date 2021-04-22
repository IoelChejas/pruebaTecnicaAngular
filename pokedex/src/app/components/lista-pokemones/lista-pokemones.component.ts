import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-lista-pokemones',
  templateUrl: './lista-pokemones.component.html',
  styleUrls: ['./lista-pokemones.component.css']
})
export class ListaPokemonesComponent implements OnInit {
  pokemones: any[] = []

  constructor(
    private _pokemonService: PokemonService,
    private toastr: ToastrService,
    private storage: AngularFireStorage) {

  }

  ngOnInit(): void {
    this.getPokemones()
  }

  getPokemones() {
    this._pokemonService.getPokemones().subscribe(data => {
      this.pokemones = []
      data.forEach((element: any) => {
        this.pokemones.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      })
      console.log(this.pokemones)
    })
  }

  eliminarPokemon(id: string) {
    this._pokemonService.getPokemon(id).subscribe(data => {
      const urlImagen = data.payload.data()["urlImagen"]
      this.storage.storage.refFromURL(urlImagen).delete()
    })
    this._pokemonService.eliminarPokemon(id).then(() => {
      this.toastr.error('El pokemon fue borrado con éxito', 'Pokemon borrado', {
        positionClass: "toast-bottom-right"
      });
    }).catch(error => {
      console.log(error)
    })
  }

}
