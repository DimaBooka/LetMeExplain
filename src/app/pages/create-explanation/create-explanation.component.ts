import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core'

import { SlidesService } from '../../services/slides.service'

@Component({
  selector: 'app-create-explanation',
  templateUrl: './create-explanation.component.html',
  styleUrls: ['./create-explanation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateExplanationComponent implements AfterViewInit {
  @ViewChild('editor') editor?: ElementRef

  draw = false

  onMouseDown() {
    this.draw = true
  }

  onMouseUp(e?: MouseEvent | TouchEvent) {
    if (e instanceof TouchEvent ) {
      this.prevX = null
      this.prevY = null
    }

    this.draw = false
  }

  prevX: number | null = null
  prevY: number | null = null

  onMouseMove(e: MouseEvent | TouchEvent) {
    let offset = 195 // height fo header

    if (e instanceof TouchEvent ) {
      console.log(e.touches[0].screenX)
      offset = 0
    }

    const currentX = e instanceof TouchEvent ? e.touches[0].screenX : e.screenX
    const currentY = (e instanceof TouchEvent ? e.touches[0].screenY : e.screenY) - offset

    if (this.prevX == null || this.prevY == null || !this.draw) {
      this.prevX = currentX
      this.prevY = currentY
      return
    }

    this.slidesService.editorContext?.beginPath()
    this.slidesService.editorContext?.moveTo(this.prevX, this.prevY)
    this.slidesService.editorContext?.lineTo(currentX, currentY)
    this.slidesService.editorContext?.stroke()

    this.prevX = currentX
    this.prevY = currentY
    this.cdr.markForCheck()
  }

  lastSelectedColor: string = '#fff'
  lastSelectedLineWidth: number = 5

  constructor(private cdr: ChangeDetectorRef, private slidesService: SlidesService) {}

  ngAfterViewInit() {
    if (!this.editor) {
      return
    }

    this.slidesService.editor = this.editor
    this.slidesService.editor.nativeElement.height = window.innerHeight - 58
    this.slidesService.editor.nativeElement.width = window.innerWidth
    this.slidesService.editorContext = this.editor.nativeElement.getContext('2d')
    this.slidesService.slides = [{ name: 'Slide #1', dataURL: '' }]

    this.onSetColor(this.lastSelectedColor)
    this.onSetLineWidth(this.lastSelectedLineWidth)

    if (!this.slidesService.editorContext) {
      return
    }
    this.slidesService.editorContext.lineCap = "round"

    this.cdr.detectChanges()
  }

  onSetLineWidth(width: number) {
    if (!this.slidesService.editorContext) {
      return
    }
    this.lastSelectedLineWidth = width
    this.slidesService.editorContext.lineWidth = width

    this.cdr.markForCheck()
  }

  onSetColor(color: string) {
    if (!this.slidesService.editorContext) {
      return
    }
    this.lastSelectedColor = color
    this.slidesService.editorContext.strokeStyle = color

    this.cdr.markForCheck()
  }
}
