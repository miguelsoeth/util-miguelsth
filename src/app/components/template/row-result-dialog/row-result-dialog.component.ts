import { CommonModule } from '@angular/common';
import { NetworkDegreeService } from './../../../services/network-degree.service';
import { Component, EventEmitter, Inject, Input, OnInit, Output, inject } from '@angular/core';

@Component({
  selector: 'app-row-result-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './row-result-dialog.component.html',
  styleUrl: './row-result-dialog.component.css'
})
export class RowResultDialogComponent implements OnInit {
  @Input() data?: string[]; 
  @Output() close = new EventEmitter<void>(); 
  result?: { [key: string]: string };
  resultKeys?: string[];
  network = inject(NetworkDegreeService);

  isLoading: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    if (this.data) {
      this.isLoading = true;
      this.isError = false;

      this.network.putImages(this.data).subscribe({
        next: (result) => {
          this.result = result;
          this.resultKeys = Object.keys(this.result);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err;
          this.result = undefined;
          this.isLoading = false;
          this.isError = true;
        }
      });
    }
  }

  closeDialog(): void {
    this.close.emit();
  }
}
