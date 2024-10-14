import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly baseUrl: string = "https://miguelsth-host.ddns.net:3000/api/image";

  constructor(private http: HttpClient) { }

  getImage(text: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/${text}`);
  }
}
