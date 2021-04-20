import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private firestore: AngularFirestore) { }

  agregarPokemon(pokemon: any): Promise<any> {
    return this.firestore.collection('pokemones').add(pokemon)
  }

  getPokemones(): Observable<any> {
    return this.firestore.collection("pokemones", ref => ref.orderBy('fechaCreacion', 'desc')).snapshotChanges()
  }

  eliminarPokemon(id): Promise<any> {
    return this.firestore.collection("pokemones").doc(id).delete()
  }

  getPokemon(id: string): Observable<any> {
    return this.firestore.collection("pokemones").doc(id).snapshotChanges()
  }

  actualizarEmpleado(id: string, data: any): Promise<any> {
    return this.firestore.collection("pokemones").doc(id).update(data)
  }
}
