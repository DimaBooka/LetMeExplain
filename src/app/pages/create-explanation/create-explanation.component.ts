import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core'
import { retry } from 'rxjs'
import { SlidesService } from '../../services/slides.service'

@Component({
  selector: 'app-create-explanation',
  templateUrl: './create-explanation.component.html',
  styleUrls: ['./create-explanation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateExplanationComponent implements AfterViewInit {
  @ViewChild('editor') editor?: ElementRef
  editorContext: CanvasRenderingContext2D | null = null

  draw = false

  onMouseDown() {
    this.draw = true
  }

  onMouseUp() {
    this.draw = false
  }

  prevX: number | null = null
  prevY: number | null = null

  onMouseMove(e: MouseEvent) {
    if (this.prevX == null || this.prevY == null || !this.draw) {
      this.prevX = e.clientX
      this.prevY = e.clientY
      return
    }

    let currentX = e.clientX
    let currentY = e.clientY

    this.editorContext?.beginPath()
    this.editorContext?.moveTo(this.prevX, this.prevY)
    this.editorContext?.lineTo(currentX, currentY)
    this.editorContext?.stroke()

    this.prevX = currentX
    this.prevY = currentY
    this.cdr.markForCheck()
  }

  colors: string[] = [
    '#fff',
    '#03bb56',
    '#fd7200',
    '#fa2c11',
    '#000',
    '#2b2b2b'
  ]
  lastSelectedColor: string = this.colors[0]

  slides: { name: string, dataURL: string}[] = [{ name: 'Slide #1', dataURL: '' }]
  currentSlideIndex = 0

  constructor(private cdr: ChangeDetectorRef, private slidesService: SlidesService) {}

  ngAfterViewInit() {
    if (!this.editor) {
      return
    }

    this.editor.nativeElement.height = window.innerHeight
    this.editor.nativeElement.width = window.innerWidth

    this.editorContext = this.editor.nativeElement.getContext('2d')
    this.onSetColor(this.colors[0])
    this.onSetLineWidth(5)

    if (!this.editorContext) {
      return
    }
    this.editorContext.lineCap = "round"

    this.cdr.detectChanges()
  }

  onSetLineWidth(width: number) {
    if (!this.editorContext) {
      return
    }
    this.editorContext.lineWidth = width
    this.cdr.markForCheck()
  }

  onSetColor(color: string) {
    if (!this.editorContext) {
      return
    }
    this.lastSelectedColor = color
    this.editorContext.strokeStyle = color

    // for eraser let's use bigger radius
    this.onSetLineWidth(this.colors[this.colors.length - 1] === color ? 15 : 5)

    this.cdr.markForCheck()
  }

  onClear() {
    if (!this.editor) {
      return
    }
    this.editorContext?.clearRect(0, 0, this.editor.nativeElement.width, this.editor.nativeElement.height)
    this.cdr.markForCheck()
  }

  onChangeSlide(index: number) {
    if (!this.editor) {
      return
    }

    // save current progress to slide
    this.slides[this.currentSlideIndex].dataURL = this.editor.nativeElement.toDataURL('imag/png')

    this.drawSlide(index)
  }

  onNextSlide(clear?: boolean) {
    if (!this.editor) {
      return
    }

    this.slides[this.currentSlideIndex].dataURL = this.editor.nativeElement.toDataURL('imag/png')
    if (clear) {
      this.onClear()
    }
    this.slides.push({ name: `Slide #${this.slides.length + 1}`, dataURL: '' })
    this.currentSlideIndex = this.slides.length - 1
    this.cdr.markForCheck()
  }

  onRemoveSlide(index: number) {
    this.slides.splice(index, 1)

    // if removed slide is currently selected slide
    if (this.currentSlideIndex === index) {
      //if slides available then take first slide near removed
      if (this.slides.length > 0) {

        // next otherwise prev slide
        let newIndex = this.slides.length - 1 >= index ? index : index - 1

        // negative value, then last available
        this.drawSlide(newIndex >= 0 ? newIndex : this.slides.length - 1)
      }
      //if no slides available then create new
      else {
        this.onClear()
        this.slides.push({ name: `Slide #${this.slides.length + 1}`, dataURL: '' })
        this.currentSlideIndex = this.slides.length - 1
      }
    }
    // if not - then update index value
    else {
      // remove 1 when removed slide before current
      this.currentSlideIndex -= this.currentSlideIndex > index ? 1 : 0
    }

    this.cdr.markForCheck()
  }

  drawSlide(index: number) {
    const slide = this.slides[index]
    this.currentSlideIndex = index

    const img = new Image()
    img.onload = () => {
      this.onClear()
      this.editorContext?.drawImage(img, 0, 0)
    }
    img.src = slide.dataURL
    this.cdr.markForCheck()
  }

  onDownload() {
    if (!this.editor) {
      return
    }

    this.slides[this.currentSlideIndex].dataURL = this.editor.nativeElement.toDataURL('imag/png')

    const data = this.slides.map(s => s.dataURL).map((s, i) => `${i > 0 ? '---\n' : ''}![image](${s})\n`).join('')

    let a = document.createElement('a')
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data)
    a.download = 'explanation.md'
    a.click()

    this.cdr.markForCheck()
  }

  onUpload(fileContent: string) {
    this.slidesService.uploadSlides(fileContent)
    this.slides = this.slidesService.slides
  }
}
