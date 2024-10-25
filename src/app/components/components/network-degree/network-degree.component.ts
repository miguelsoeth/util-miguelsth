import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { HeaderService } from '../../../services/header.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NativeSearchFieldComponent } from '../../template/native-search-field/native-search-field.component';
import { NetworkDegreeService } from '../../../services/network-degree.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AllNetworkResult } from '../../../interfaces/all-network-result';
import { RowResultDialogComponent } from '../../template/row-result-dialog/row-result-dialog.component';

@Component({
  selector: 'app-network-degree',
  standalone: true,
  imports: [CommonModule, FormsModule, NativeSearchFieldComponent, RowResultDialogComponent],
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
  type: string = '';
  result: { [key: string]: string } = {}; // Assuming this is your result object
  resultKeys?: string[];
  resultAll?: AllNetworkResult;

  isLoading: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';

  showDialog: boolean = false;
  dialogData?: string[]; 


  ngOnInit(): void {
    this.header.setTitle("8 Graus de Network");

    this.route.queryParams.subscribe(params => {
      this.originActor = params['origin'] || '';
      this.destinyActor = params['destiny'] || '';
      this.type = params['type'] || '';

      this.selectOrigin(this.originActor);
      this.selectDestiny(this.destinyActor);
      if (this.type == "all") {
        this.calculateAllNetworkDegree(); 
        // this.resultAll = {
        //     "total": 45,
        //     "results": {
        //         "Robert Downey Jr.->Oppenheimer->Cillian Murphy->28 Days Later->Brendan Gleeson->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Oppenheimer->Emily Blunt->Edge of Tomorrow->Brendan Gleeson->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Oppenheimer->Emily Blunt->Jungle Cruise->Dwayne Johnson->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Oppenheimer->Matt Damon->The Martian->Sean Bean->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Oppenheimer->Matt Damon->The Martian->Aksel Hennie->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Oppenheimer->Matt Damon->Ocean's Eleven->Brad Pitt->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Oppenheimer->Josh Hartnett->Black Hawk Down->Eric Bana->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Oppenheimer->Josh Hartnett->Black Hawk Down->Orlando Bloom->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Oppenheimer->Casey Affleck->Ocean's Eleven->Brad Pitt->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Avengers: Infinity War->Chris Evans->Ghosted->Tate Donovan->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Avengers: Infinity War->Scarlett Johansson->The Island->Sean Bean->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Avengers: Infinity War->Benedict Cumberbatch->The Hobbit: The Desolation of Smaug->Orlando Bloom->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Avengers: Infinity War->Zoe Saldaña->Star Trek->Eric Bana->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Iron Man 2->Gwyneth Paltrow->Se7en->Brad Pitt->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Iron Man 2->Scarlett Johansson->The Island->Sean Bean->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Iron Man 2->Samuel L. Jackson->True Romance->Brad Pitt->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Avengers: Endgame->Chris Evans->Ghosted->Tate Donovan->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Avengers: Endgame->Scarlett Johansson->The Island->Sean Bean->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Avengers: Endgame->Benedict Cumberbatch->The Hobbit: The Desolation of Smaug->Orlando Bloom->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->The Avengers->Chris Evans->Ghosted->Tate Donovan->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->The Avengers->Scarlett Johansson->The Island->Sean Bean->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->The Avengers->Samuel L. Jackson->True Romance->Brad Pitt->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Spider-Man: Homecoming->Gwyneth Paltrow->Se7en->Brad Pitt->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Captain America: Civil War->Chris Evans->Ghosted->Tate Donovan->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Captain America: Civil War->Scarlett Johansson->The Island->Sean Bean->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Captain America: Civil War->Sebastian Stan->The Martian->Sean Bean->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Captain America: Civil War->Sebastian Stan->The Martian->Aksel Hennie->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Captain America: Civil War->Daniel Brühl->Inglourious Basterds->Brad Pitt->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Captain America: Civil War->Daniel Brühl->Inglourious Basterds->Diane Kruger->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Captain America: Civil War->Anthony Mackie->Real Steel->Kevin Durand->Kingdom of the Planet of the Apes->Freya Allan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Captain America: Civil War->Anthony Mackie->Abraham Lincoln: Vampire Hunter->Rufus Sewell->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Avengers: Age of Ultron->Chris Evans->Ghosted->Tate Donovan->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Avengers: Age of Ultron->Scarlett Johansson->The Island->Sean Bean->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Avengers: Age of Ultron->Aaron Taylor-Johnson->Bullet Train->Brad Pitt->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Iron Man->Gwyneth Paltrow->Se7en->Brad Pitt->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Iron Man 3->Gwyneth Paltrow->Se7en->Brad Pitt->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Iron Man 3->Guy Pearce->L.A. Confidential->Danny DeVito->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Iron Man 3->Ben Kingsley->Stonehearst Asylum->Brendan Gleeson->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Iron Man 3->Ty Simpkins->Insidious: The Red Door->Rose Byrne->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Iron Man 3->Ty Simpkins->Insidious->Rose Byrne->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Iron Man 3->Rebecca Hall->The BFG->Matt Frewer->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Iron Man 3->James Badge Dale->World War Z->Brad Pitt->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->The Judge->Vincent D'Onofrio->Men in Black->Rip Torn->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Sherlock Holmes->Jude Law->King Arthur: Legend of the Sword->Eric Bana->Troy->Saffron Burrows->Baghead->Julika Jenkins": 8,
        //         "Robert Downey Jr.->Sherlock Holmes->Eddie Marsan->Fast & Furious Presents: Hobbs & Shaw->Dwayne Johnson->Hercules->Peter Mullan->Baghead->Julika Jenkins": 8
        //     }
        // }
        // console.log(this.resultAll);
      }
      else {
        this.calculateNetworkDegree();
      }      
    });
  }

  calculateNetworkDegree() {
    if (this.originActor && this.destinyActor) {
      this.resultKeys = [];
      this.resultAll = undefined;
      this.isLoading = true;
      this.isError = false;
      this.network.getNetwork(this.originActor, this.destinyActor).subscribe({
        next: (result): void => {
          this.result = result;
          this.resultKeys = Object.keys(this.result);
          this.isLoading = false;
        },
        error: (err): void => {
          if (err.status === 404) {
            this.isLoading = false;
            this.isError = true;
            this.errorMessage = 'Conexão entre atores não encontrada.';
          } else if (err.status === 500) {
            this.isLoading = false;
            this.isError = true;
            this.errorMessage = 'Erro ao encontrar conexão.';
          } else {
            this.isError = true;
            this.isLoading = false;
            this.errorMessage = 'Erro desconhecido.';
          }
        }
      });
    }    
  }

  calculateAllNetworkDegree() {
    if (this.originActor && this.destinyActor) {
      this.resultKeys = [];
      this.resultAll = undefined;
      this.isLoading = true;
      this.isError = false;
      this.network.getAllNetwork(this.originActor, this.destinyActor).subscribe({
        next: (result): void => {
          this.resultAll = result;
          this.isLoading = false;
        },
        error: (err): void => {
          this.isLoading = false;
          this.isError = true;
        }
      });
    }    
  }

  selectOrigin(option: string) {
    this.originActor = option;
    //console.log('Selected origin Actor:', this.originActor);
  }

  selectDestiny(option: string) {
    this.destinyActor = option;
    //console.log('Selected destiny Actor:', this.destinyActor);
  }

  goToNetworkQuery() {
    if (this.originActor && this.destinyActor) {
      const queryParams = {
        type: "shortest",
        origin: this.originActor,
        destiny: this.destinyActor
      };
      this.router.navigate(['/network-degree'], { queryParams });
    }
  } 

  goToAllNetworkQuery() {
    if (this.originActor && this.destinyActor) {
      const queryParams = {
        type: "all",
        origin: this.originActor,
        destiny: this.destinyActor
      };
      this.router.navigate(['/network-degree'], { queryParams });      
    }
  }

  getKeys(results: Record<string, number>): string[] {
    return Object.keys(results);
  }

  getTableRow(key: string): void {
    const result: string[] = key.split('->').map(item => item.trim());
    this.dialogData = result;
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
  }
  
}
