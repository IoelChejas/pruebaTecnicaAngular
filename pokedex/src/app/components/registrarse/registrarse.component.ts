import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent implements OnInit {

  constructor(public auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
    if (this.auth.user) {
      this.router.navigate(['lista-pokemones'])
    }
  }

}
