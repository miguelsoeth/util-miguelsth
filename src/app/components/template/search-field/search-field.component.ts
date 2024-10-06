import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewContainerRef, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap, of, Subject } from 'rxjs';
import { NetworkDegreeService } from '../../../services/network-degree.service';
import { ActorResponse } from '../../../interfaces/actor-response';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css']
})
export class SearchFieldComponent implements OnInit {

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('resultListTemplate') resultListTemplate!: TemplateRef<any>;  // Use TemplateRef instead of ElementRef

  searchTerm = new Subject<string>();
  results: string[] = [];
  networkDegree = inject(NetworkDegreeService);

  private overlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.searchEntries(term))
    ).subscribe((response: ActorResponse) => {
      this.results = response.results;
      if (this.results.length > 0) {
        this.openOverlay();
      } else {
        this.closeOverlay();
      }
    });
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.next(term);
  }

  searchEntries(term: string) {
    if (term === '') {
      this.closeOverlay();
      return of({
        results: [],
        total: 0,
        currentPage: 1,
        totalPages: 1
      });
    }
    return this.networkDegree.getActor(term);
  }

  private openOverlay() {
    if (!this.overlayRef) {
      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(this.searchInput)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        }]);

      this.overlayRef = this.overlay.create({
        hasBackdrop: false,
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition()
      });
    }

    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      const portal = new TemplatePortal(this.resultListTemplate, this.viewContainerRef);  // Use TemplatePortal with TemplateRef
      this.overlayRef.attach(portal);
    }
  }

  private closeOverlay() {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }
}
