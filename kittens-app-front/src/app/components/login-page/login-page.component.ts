import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {TokenStorageService} from '../../services/token-storage/token-storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  email: string | undefined;
  password: string | undefined;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) {
  }

  ngOnInit(): void {
    if (this.tokenStorage.getUser()) {
      this.router.navigate(['/deadlines']).then();
    }
  }

  onSubmit(): void {
    if (this.email && this.password) {
      this.authService.login({email: this.email, password: this.password}).subscribe(data => {
        const response = JSON.parse(data);
        this.tokenStorage.saveToken(response.jwt);
        this.tokenStorage.saveUser(response.user);
        this.router.navigate(['/deadlines']).then();
      });
    }
  }
}
