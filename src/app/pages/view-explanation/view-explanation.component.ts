import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, OnDestroy,
  ViewChild
} from '@angular/core'

import Reveal  from 'reveal.js'
import RevealMarkdown  from 'reveal.js/plugin/markdown/markdown'
import { SlidesService } from '../../services/slides.service'
import { Slide } from '../../models/slides'


@Component({
  selector: 'app-view-explanation',
  templateUrl: './view-explanation.component.html',
  styleUrls: ['./view-explanation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewExplanationComponent implements AfterViewInit, OnDestroy {

  @ViewChild('presentation') presentation?: ElementRef

  file?: string

  constructor(private cdr: ChangeDetectorRef, private slidesService: SlidesService) {}

  ngAfterViewInit() {
    if (this.slidesService.slides.length) {
      this.initPresentation()
    }
  }

  ngOnDestroy() {
    this.file = undefined
    this.slidesService.slides = []
  }

  initPresentation() {
    this.file = this.slidesService.slides.map(s => s.dataURL).map((s, i) => `${i > 0 ? '---\n' : ''}![image](${s})\n`).join('')
    if (this.presentation) {
      const slides = `<div class="reveal">
        <div class="slides">
          <section data-markdown data-separator="---">
            <script type="text/template">${this.file}</script>
          </section>
        </div>
      </div>`

      const content = `<!doctype html>
        <html style=\"margin: 0;height: 100%;\">
        <head>

          <style>
            .reveal.center button {
              box-shadow: none;
            }

            .reveal.center .slides section {
              top: 0 !important;
              -webkit-transform: none;
              -moz-transform: none;
              -ms-transform: none;
              -o-transform: none;
              transform: none;

              -webkit-transition: none;
              -moz-transition: none;
              -ms-transition: none;
              -o-transition: none;
              transition: none;
            }

            .reveal .backgrounds {
              background-color: #2b2b2b;
            }
          </style>
          <link rel="stylesheet" href=\"https://cdn.jsdelivr.net/gh/hakimel/reveal.js@4.4.0/dist/reveal.css\">
          <link rel="stylesheet" href=\"https://cdn.jsdelivr.net/gh/hakimel/reveal.js@4.4.0/dist/theme/league.css\">
        </head>
        <body style=\"margin: 0;height: 100%;\">
          ${slides}
          <script src=\"https://cdn.jsdelivr.net/gh/hakimel/reveal.js@4.4.0/dist/reveal.js\"></script>
          <script src=\"https://cdn.jsdelivr.net/gh/hakimel/reveal.js@4.4.0/plugin/markdown/markdown.js\"></script>
          <script>
            Reveal.initialize({
              embedded: true,
              plugins: [RevealMarkdown]
            })
          </script>
        </body>
      </html>`

      this.presentation.nativeElement.innerHTML = `<iframe srcdoc='${content}'></iframe>`
    }
  }

  onFileUpload(fileContent: string) {
    this.slidesService.parseSlides(fileContent)
    if (this.slidesService.slides.length) {
      this.initPresentation()
    }
  }
}
