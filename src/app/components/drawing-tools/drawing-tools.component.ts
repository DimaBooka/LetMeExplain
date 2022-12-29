import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-drawing-tools',
  templateUrl: './drawing-tools.component.html',
  styleUrls: ['./drawing-tools.component.scss']
})
export class DrawingToolsComponent {
  colors: string[] = [
    '#fff',
    '#000',
    '#15c9d9',
    '#03bb56',
    '#fd7200',
    '#fa2c11',
  ]
  lineWidths: number[] = [5, 10, 15, 20]

  eraserColor = '#2b2b2b'
  eraserLineWidth = this.lineWidths[3]

  @Input() selectedColor: string = this.colors[0]
  @Input() selectedLineWidth: number = this.lineWidths[0]

  @Output() setColor: EventEmitter<string> = new EventEmitter<string>()
  @Output() setLineWidth: EventEmitter<number> = new EventEmitter<number>()

  onSetColor(color: string) {
    if (this.selectedLineWidth == this.eraserLineWidth && this.selectedColor === this.eraserColor) {
      this.setLineWidth.emit(this.lineWidths[0])
    }

    this.setColor.emit(color)
  }

  setEraser() {
    this.setColor.emit(this.eraserColor)
    this.setLineWidth.emit(this.eraserLineWidth)
  }
}
