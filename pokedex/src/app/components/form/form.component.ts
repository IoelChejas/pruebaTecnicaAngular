import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import auth from 'firebase/app'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Input() action: string

  email = ""
  pass = ""

  constructor(public auth: AngularFireAuth, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  loginWithGoogle() {
    this.auth.signInWithPopup(new auth.auth.GoogleAuthProvider).then(res => {
      this.router.navigate(['lista-pokemones'])
    })
  }

  logout() {
    this.auth.signOut()
  }

  customLogin() {
    this.auth.signInWithEmailAndPassword(this.email, this.pass)
      .then(res => {
        this.router.navigate(['lista-pokemones'])
      })
      .catch(err => {
        this.toastr.error('Asegurese de que el mail y la contrasenia sean validos', 'Email o contrasenia incorrectos', {
          positionClass: "toast-bottom-right"
        });
      });
  }

  register() {
    if (this.pass.split("").length > 5) {
      this.auth.createUserWithEmailAndPassword(this.email, this.pass)
        .then((user) => {
          // Signed in
          // ...
          this.toastr.success('Te registraste con exito', 'Registrado', {
            positionClass: "toast-bottom-right"
          });
          this.router.navigate(['lista-pokemones']);
        })
        .catch((error) => {
          this.toastr.error('Email ya asociado a una cuenta', 'No se pudo registrar', {
            positionClass: "toast-bottom-right"
          });
        });
    } else {
      this.toastr.error('La contrasenia debe tener por lo menos 6 caracteres', 'Contrasenia no valida', {
        positionClass: "toast-bottom-right"
      });
    }
  }
}
