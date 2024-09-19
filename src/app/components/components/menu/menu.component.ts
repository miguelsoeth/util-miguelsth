import { Component, OnInit, inject } from '@angular/core';
import { HeaderService } from '../../../services/header.service';
import { Router } from '@angular/router';
import { NgForOf } from '@angular/common';
import { MenuItem } from '../../../interfaces/menu-item';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  
  header = inject(HeaderService);
  router = inject(Router);

  menuItems: MenuItem[] = [
    {
      title: 'Desenhar grafo apartir de sequência de grau',
      description: 'Gera um grafo cujos vértices têm graus iguais aos da sequência fornecida utilizando o critério de Havel-Hakimi ',
      route: '/sequence-to-graph'
    }
  ]
  
  ngOnInit(): void {
    this.header.setTitle("");
  }

  navigateTo(item: MenuItem): void {    
    this.router.navigate([item.route]);
  }

}
