import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { NetworkDegreeService } from '../../../services/network-degree.service';
import { ActorResponse } from '../../../interfaces/actor-response';
@Component({
  selector: 'app-native-search-field',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './native-search-field.component.html',
  styleUrl: './native-search-field.component.css'
})
export class NativeSearchFieldComponent implements OnInit {

  myControl = new FormControl('');
  filteredOptions!: Observable<string[]>;
  @Output() optionSelected = new EventEmitter<string>();
  showOptions = false;
  network = inject(NetworkDegreeService);

  @Input() set selectedOption(value: string | null) {
    if (value) {
      this.myControl.setValue(value);
    }
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.network.getActor(value || '').pipe(
        map((response: ActorResponse) => response.results)
      ))
    );
  }

  selectOption(option: string) {
    this.myControl.setValue(option);
    this.showOptions = false; 
    this.optionSelected.emit(option)
  }

  hideOptions() {
    setTimeout(() => this.showOptions = false, 200);
  }
}