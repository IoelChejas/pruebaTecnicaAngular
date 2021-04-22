import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  nombre: string
  nombreCargado: string

  constructor(public auth: AngularFireAuth) { }

  async ngOnInit() {
    const user = await this.auth.currentUser
    this.nombreCargado = user.displayName
  }

  async editar() {
    const userNow = await this.auth.currentUser
    userNow.updateProfile({
      displayName: this.nombre
    })
  }

}
