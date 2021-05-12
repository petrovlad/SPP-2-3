import {Component, OnInit} from '@angular/core';
import {FieldsService} from '../../services/deadlines/fields.service';
import {DeadlineDTO} from '../../model/deadlineDTO';
import {TokenStorageService} from '../../services/token-storage/token-storage.service';
import {UserDTO} from '../../model/userDTO';
import {Router} from '@angular/router';

@Component({
  selector: 'app-deadlines-page',
  templateUrl: './deadlines-page.component.html',
  styleUrls: ['./deadlines-page.component.css']
})
export class DeadlinesPageComponent implements OnInit {

  isAuthenticated = false;
  user: UserDTO | undefined;
  deadlines: Array<DeadlineDTO> | undefined = [];

  title = '';
  description = '';
  expirationDate = '';
  activeDeadline: DeadlineDTO | undefined;

  constructor(private deadlinesService: FieldsService, private tokenStorage: TokenStorageService, private router: Router) {
  }

  ngOnInit(): void {
    if (!this.tokenStorage.getUser()) {
      this.isAuthenticated = false;
      this.user = undefined;
      this.router.navigate(['']).then();
    } else {
      this.isAuthenticated = true;
      this.user = this.tokenStorage.getUser() as UserDTO;

      this.deadlinesService.getDeadlines().subscribe(data => {
        this.deadlines = JSON.parse(data);
        console.log(JSON.stringify(this.deadlines));
        if (!this.deadlines || this.deadlines?.length === 0) {
          this.deadlines = undefined;
        }
      });
    }
  }

  onLogOutClick(): void {
    this.isAuthenticated = false;
    this.user = undefined;
    this.tokenStorage.signOut();
  }

  onDeleteClick(id: string | undefined): void {
    if (this.deadlines && id) {
      for (let i = 0; i < this.deadlines.length; i++) {
        if (this.deadlines[i]._id === id) {
          this.deadlines.splice(i, 1);
          this.deadlinesService.deleteDeadline(id).subscribe(data => console.log('DELETED: ' + data));
        }
      }
    }

    if (this.deadlines?.length === 0) {
      this.deadlines = undefined;
    }
  }

  onModalClose(): void {
    this.activeDeadline = undefined;
    this.title = '';
    this.expirationDate = '';
    this.description = '';
  }

  onModalSubmit(): void {
    console.log('Title: ' + this.title);
    console.log('Expiration Date: ' + this.expirationDate);
    console.log('Description: ' + this.description);
    console.log(this.tokenStorage.getUser()._id);

    if (this.activeDeadline) {
      this.activeDeadline.title = this.title;
      this.activeDeadline.expirationDate = this.expirationDate;
      this.activeDeadline.description = this.description;

      this.deadlinesService.updateDeadline(this.activeDeadline).subscribe(data => {
        console.log('UPDATED: ' + data);
      });
    } else {
      let newDeadline = new DeadlineDTO(
        undefined,
        this.title,
        this.tokenStorage.getUser()._id,
        this.description,
        '',
        this.expirationDate
      );

      this.deadlinesService.createDeadline(newDeadline).subscribe(data => {
        const deadline = JSON.parse(data);

        if (!this.deadlines) {
          this.deadlines = [];
        }
        this.deadlines?.push(deadline);
      });
    }
  }

  onCreateClick(): void {
    this.activeDeadline = undefined;
    this.title = '';
    this.expirationDate = '';
    this.description = '';
  }

  onEditCLick(id: string | undefined): void {
    if (this.deadlines && id) {
      for (let i = 0; i < this.deadlines.length; i++) {
        if (this.deadlines[i]._id === id) {
          this.activeDeadline = this.deadlines[i];
          this.title = this.activeDeadline.title;
          this.expirationDate = this.activeDeadline.expirationDate;
          this.description = this.activeDeadline.description;
        }
      }
    }
  }
}
