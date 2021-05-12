import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {TokenStorageService} from '../../services/token-storage/token-storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  email: string | undefined;
  password: string | undefined;
  name: string | undefined;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) {
  }

  ngOnInit(): void {
    if (this.tokenStorage.getUser()) {
      this.router.navigate(['/deadlines']).then();
    }
  }

  onSubmit(): void {
    if (this.email && this.password && this.name) {
      this.authService.register({name: this.name, email: this.email, password: this.password}).subscribe(data => {
        const response = JSON.parse(data);
        this.tokenStorage.saveToken(response.jwt);
        this.tokenStorage.saveUser(response.user);
        this.router.navigate(['/deadlines']).then();
      });
    }
  }
}
