import { Component, OnInit, inject } from '@angular/core';
import { HeaderService } from '../../../services/header.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchFieldComponent } from '../../template/search-field/search-field.component';
import { NativeSearchFieldComponent } from '../../template/native-search-field/native-search-field.component';
import { NetworkDegreeService } from '../../../services/network-degree.service';

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

  originActor?: string;
  destinyActor?: string;
  result?: string[];

  ngOnInit(): void {
    this.header.setTitle("Network degree");
  }

  selectOrigin(option: string) {
    this.originActor = option;
    console.log('Selected origin Actor:', this.originActor);
  }

  selectDestiny(option: string) {
    this.destinyActor = option;
    console.log('Selected destiny Actor:', this.destinyActor);
  }

  calculateNetworkDegree() {
    if (this.originActor != undefined && this.destinyActor != undefined) {
      this.network.getNetwork(this.originActor, this.destinyActor).subscribe({
        next: (result): void => {
          this.result = result;
        }
      })
    }    
  }

}
