import { Router } from '@angular/router';
import { HeaderService } from './../../../services/header.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {

  header = inject(HeaderService);
  router = inject(Router);

  get title(): string {
    return this.header.getTitle;
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

}
