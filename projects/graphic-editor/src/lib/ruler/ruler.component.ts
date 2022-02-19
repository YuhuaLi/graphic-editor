import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Placement } from '../model';
import ResizeObserver from 'resize-observer-polyfill';

@Component({
  selector: 'lib-ruler',
  templateUrl: './ruler.component.html',
  styleUrls: ['./ruler.component.scss'],
})
export class RulerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() placement: 'horizontal' | 'vertical' = Placement.Horizontal;
  @Input() offset = 0;
  @Input() zoom = 1;
  @ViewChild('cv', { static: true }) canvas!: ElementRef;

  gap = 10;
  resizeObserver: ResizeObserver | null = null;

  constructor() {}

  ngOnInit(): void {
    this.initCanvas();
    this.draw();
    this.resizeObserver = new ResizeObserver((entries: any) => {
      this.draw();
    });

    this.resizeObserver.observe(this.canvas.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.offset) {
      this.draw();
    }
    if (changes.zoom) {
      this.gap = changes.zoom.currentValue * 10;
      this.draw();
    }
  }

  draw(): void {
    if (this.placement === Placement.Horizontal) {
      this.drawHorizontalRuler();
    } else {
      this.drawVerticalRuler();
    }
  }

  drawVerticalRuler(): void {
    const ctx = this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.strokeStyle = '#999';
    ctx.fillStyle = '#999';
    ctx.lineWidth = 1;
    ctx.font = '8px Arial';
    ctx.textBaseline = 'bottom';
    ctx.beginPath();
    let y = 0.5 - this.offset;
    const height = ctx.canvas.height;
    ctx.beginPath();
    while (y <= height) {
      if (y >= 0) {
        ctx.moveTo(0, y);
        if ((y + this.offset - 0.5) % (this.gap * 5) === 0) {
          ctx.lineTo(8, y);
          ctx.save();
          ctx.rotate(Math.PI / 2);
          ctx.fillText(`${(y + this.offset - 0.5) / this.zoom}`, y + 1, -5);
          ctx.restore();
        } else {
          ctx.lineTo(4, y);
        }
      }
      y += this.gap;
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  drawHorizontalRuler(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.strokeStyle = '#999';
    ctx.fillStyle = '#999';
    ctx.lineWidth = 1;
    ctx.font = '8px Arial';
    ctx.textBaseline = 'top';
    ctx.beginPath();
    let x = 0.5 - this.offset;
    const width = ctx.canvas.width;
    ctx.beginPath();
    while (x <= width) {
      if (x >= 0) {
        ctx.moveTo(x, 0);
        if ((x + this.offset - 0.5) % (this.gap * 5) === 0) {
          ctx.lineTo(x, 8);
          ctx.fillText(`${(x + this.offset - 0.5) / this.zoom}`, x + 1, 5);
        } else {
          ctx.lineTo(x, 4);
        }
      }
      x += this.gap;
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  initCanvas(): void {
    const width = this.canvas.nativeElement.offsetWidth;
    const height = this.canvas.nativeElement.offsetHeight;
    this.canvas.nativeElement.width = width;
    this.canvas.nativeElement.height = height;
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }
}
