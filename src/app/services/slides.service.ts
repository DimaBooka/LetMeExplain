import { ElementRef, Injectable } from '@angular/core'
import { Slide } from '../models/slides'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SlidesService {
  update$: Subject<boolean> = new Subject()

  slides: Slide[] = []
  currentSlideIndex = 0

  editor?: ElementRef
  editorContext?: CanvasRenderingContext2D

  constructor() {}

  resetSlides() {
    this.editor = undefined
    this.editorContext = undefined
    this.slides = []
  }

  onClear() {
    if (!this.editor) {
      return
    }
    this.editorContext?.clearRect(0, 0, this.editor.nativeElement.width, this.editor.nativeElement.height)
    this.update$.next(true)
  }

  onChangeSlide(index: number, withSave: boolean = false) {
    if (!this.editor) {
      return
    }
    console.log(this.slides)

    if (withSave) {
      // save current progress to slide
      this.slides[this.currentSlideIndex].dataURL = this.editor.nativeElement.toDataURL('imag/png')
    }

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

    this.slides.splice(this.currentSlideIndex + 1, 0, { name: `Slide #${this.currentSlideIndex + 1}`, dataURL: '' })
    this.currentSlideIndex = this.currentSlideIndex + 1

    this.update$.next(true)
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

    this.update$.next(true)
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
    this.update$.next(true)
  }

  onUpload(fileContent: string) {
    this.parseSlides(fileContent)
    this.currentSlideIndex = 0
    this.onChangeSlide(0, false)
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
  }

  parseSlides(uploadedFile: string) {
    try {
      // split content to slides
      const slides = uploadedFile.split('---').map((s, i) => {
        const slide = s.replace(/\n/g,'')
        return { name: `Slide #${i + 1}`, dataURL: slide.substring(9, slide.length - 2) }
      })

      this.slides = slides
    } catch (e) {
      // show incorrect format error
    }
  }
}
