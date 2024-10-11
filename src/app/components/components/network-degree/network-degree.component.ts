import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { HeaderService } from '../../../services/header.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchFieldComponent } from '../../template/search-field/search-field.component';
import { NativeSearchFieldComponent } from '../../template/native-search-field/native-search-field.component';
import { NetworkDegreeService } from '../../../services/network-degree.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-network-degree',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchFieldComponent, NativeSearchFieldComponent],
  templateUrl: './network-degree.component.html',
  styleUrl: './network-degree.component.css'
})
export class NetworkDegreeComponent implements OnInit {

  header = inject(HeaderService);
  network = inject(NetworkDegreeService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  http = inject(HttpClient);

  originActor: string = '';
  destinyActor: string = '';
  result?: string[];
  images: { [key: string]: string } = {};

  ngOnInit(): void {
    this.header.setTitle("Network degree");

    this.route.queryParams.subscribe(params => {
      this.originActor = params['origin'] || '';
      this.destinyActor = params['destiny'] || '';

      this.calculateNetworkDegree();
    });
  }

  calculateNetworkDegree() {
    if (this.originActor && this.destinyActor) {
      this.network.getNetwork(this.originActor, this.destinyActor).subscribe({
        next: (result): void => {
          this.result = result;
          this.loadImages(result);
        },
        error: (err) => console.error('Error calculating network degree:', err)
      })
    }    
  }

  loadImages(result: string[]) {
    result.forEach((item) => {
      // Fetch image URL from your API for each item
      this.http.get<string[]>(`http://localhost:3000/api/image/${item}`).subscribe({
        next: (imageUrls) => {
          if (imageUrls.length > 0) {
            this.images[item] = `https://${imageUrls[0]}`;
          } else {
            console.warn(`No images found for item: ${item}`);
          }
        },
        error: (err) => console.error('Error fetching image URLs:', err)
      });
    });
  }

  selectOrigin(option: string) {
    this.originActor = option;
    console.log('Selected origin Actor:', this.originActor);
  }

  selectDestiny(option: string) {
    this.destinyActor = option;
    console.log('Selected destiny Actor:', this.destinyActor);
  }

  goToNetworkQuery() {
    if (this.originActor && this.destinyActor) {
      const queryParams = {
        origin: this.originActor,
        destiny: this.destinyActor
      };
      this.router.navigate(['/network-degree'], { queryParams }); // Navigates to the URL with query parameters
    }
  }

}
