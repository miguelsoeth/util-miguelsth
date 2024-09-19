import { Router } from '@angular/router';
import { HeaderService } from './../../../services/header.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {

  header = inject(HeaderService);
  router = inject(Router);

  get title(): string {
    return this.header.getTitle;
  }

  get isRootRoute(): boolean {
    return this.router.url === '/';
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

}
