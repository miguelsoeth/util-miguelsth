import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { HeaderService } from '../../../services/header.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NativeSearchFieldComponent } from '../../template/native-search-field/native-search-field.component';
import { NetworkDegreeService } from '../../../services/network-degree.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-network-degree',
  standalone: true,
  imports: [CommonModule, FormsModule, NativeSearchFieldComponent],
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
  result: { [key: string]: string } = {}; // Assuming this is your result object
  resultKeys?: string[];

  ngOnInit(): void {
    this.header.setTitle("Network degree");

    this.route.queryParams.subscribe(params => {
      this.originActor = params['origin'] || '';
      this.destinyActor = params['destiny'] || '';

      this.selectOrigin(this.originActor);
      this.selectDestiny(this.destinyActor);
      this.calculateNetworkDegree();
    });
  }

  calculateNetworkDegree() {
    if (this.originActor && this.destinyActor) {
      this.network.getNetwork(this.originActor, this.destinyActor).subscribe({
        next: (result): void => {
          this.result = result;
          this.resultKeys = Object.keys(this.result);
        },
        error: (err) => console.error('Error calculating network degree:', err)
      })
    }    
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
