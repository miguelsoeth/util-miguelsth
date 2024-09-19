import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderData } from '../interfaces/header-data';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private title: string = ""

  get getTitle(): string {
    return this.title;
  }

  public setTitle(newTitle: string) {
    this.title = newTitle;
  }

}
