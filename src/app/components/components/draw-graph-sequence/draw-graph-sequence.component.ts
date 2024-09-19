import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../../services/header.service';

@Component({
  selector: 'app-draw-graph-sequence',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './draw-graph-sequence.component.html',
  styleUrl: './draw-graph-sequence.component.css'
})
export class DrawGraphSequenceComponent implements OnInit {
  header = inject(HeaderService);

  ngOnInit(): void {
    this.header.setTitle("Desenhar grafo a partir de sequência de grau");
  }

  @ViewChild('graphCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  degreeSequence: string = '';

  drawGraph() {
    const degreeSequence = this.degreeSequence.split(',').map(Number);
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!this.isGraphical(degreeSequence)) {
        alert('A sequência de graus não é gráfica!');
        return;
      }

      const nodes = this.generateNodes(degreeSequence.length, canvas.width, canvas.height);
      const edges = this.constructEdges(degreeSequence);

      this.drawEdges(ctx, nodes, edges);
      this.drawNodes(ctx, nodes);
    }
  }

  isGraphical(sequence: number[]): boolean {
    let seq = [...sequence].sort((a, b) => b - a);
    while (seq.length > 0) {
      let d = seq.shift()!;
      if (d > seq.length) return false;
      for (let i = 0; i < d; i++) {
        seq[i]--;
        if (seq[i] < 0) return false;
      }
      seq = seq.filter(val => val > 0).sort((a, b) => b - a);
    }
    return true;
  }

  generateNodes(n: number, width: number, height: number) {
    const nodes = [];
    const angleStep = (2 * Math.PI) / n;
    const radius = Math.min(width, height) / 2.5;
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < n; i++) {
      const angle = i * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      nodes.push({ x, y, label: String.fromCharCode(65 + i) }); // Labels as A, B, C, ...
    }

    return nodes;
  }

  constructEdges(degreeSequence: number[]) {
    let degrees = degreeSequence.map((deg, index) => ({ deg, index }))
                                .sort((a, b) => b.deg - a.deg);
    const edges = [];

    while (degrees.length > 0) {
      const { deg, index } = degrees.shift()!;
      for (let i = 0; i < deg; i++) {
        edges.push([index, degrees[i].index]);
        degrees[i].deg--;
      }
      degrees = degrees.filter(val => val.deg > 0).sort((a, b) => b.deg - a.deg);
    }

    return edges;
  }

  drawNodes(ctx: CanvasRenderingContext2D, nodes: any[]) {
    ctx.fillStyle = 'black';
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText(node.label, node.x + 15, node.y + 5);
    });
  }

  drawEdges(ctx: CanvasRenderingContext2D, nodes: any[], edges: any[]) {
    ctx.strokeStyle = 'black';
    edges.forEach(edge => {
      const [from, to] = edge;
      ctx.beginPath();
      ctx.moveTo(nodes[from].x, nodes[from].y);
      ctx.lineTo(nodes[to].x, nodes[to].y);
      ctx.stroke();
    });
  }
}
