import { Injectable } from '@angular/core';
import { Slide } from '../models/slides'

@Injectable({
  providedIn: 'root'
})
export class SlidesService {

  slides: Slide[] = []

  constructor() {}

  uploadSlides(uploadedFile: string) {
    try {
      // split content to slides
      const slides = uploadedFile.split('---').map((s, i) => {
        const slide = s.replace(/\n/g,'')
        return { name: `Slide #${i + 1}`, dataURL: slide.substring(9, slide.length - 2) }
      })

      this.slides = slides
    } catch (e) {
      // show incorrect format error
      // this.cdr.markForCheck()
    }
  }
}
