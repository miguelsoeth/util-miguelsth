import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private vertices: { [key: string]: { [key: string]: boolean } } = {};

  constructor() {}

  adicionarVertice(vertice: string): void {
    if (!this.vertices[vertice]) {
      this.vertices[vertice] = {};
    }
  }

  adicionarAresta(origem: string, destino: string): void {
    if (!this.vertices[origem] || !this.vertices[destino]) {
      console.log('Vértices não existem');
      return;
    }
    this.vertices[origem][destino] = true;
    this.vertices[destino][origem] = true; // Aresta bidirecional
  }

  mostraLista(): void {
    for (let vertice in this.vertices) {
      let vizinhos = Object.keys(this.vertices[vertice]);
      console.log(vertice, vizinhos);
    }
  }

  encontrarRelacionamentoMaisProximo(ator1: string, ator2: string): string[] | undefined {
    const visitados: { [key: string]: boolean } = {};
    const fila: string[][] = [[ator1]];

    visitados[ator1] = true;

    while (fila.length > 0) {
      const caminho = fila.shift()!;
      const ultimoVertice = caminho[caminho.length - 1];

      if (ultimoVertice === ator2) {
        return caminho;
      }

      for (let vizinho in this.vertices[ultimoVertice]) {
        if (!visitados[vizinho]) {
          visitados[vizinho] = true;
          const novoCaminho = [...caminho, vizinho];
          fila.push(novoCaminho);
        }
      }
    }
    return undefined;
  }
}
