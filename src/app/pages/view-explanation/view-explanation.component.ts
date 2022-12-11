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

  initReveal() {
    if ((<any>Reveal).isReady()) {
      console.log('exists');
      (<any>Reveal).layout();
      (<any>Reveal).sync();
    } else {
      Reveal.initialize({
        plugins: [RevealMarkdown]
      }).then(() => {
        (<any>Reveal).sync();
      })
    }

    this.cdr.detectChanges()
  }

  initPresentation() {
    this.file = this.slidesService.slides.map(s => s.dataURL).map((s, i) => `${i > 0 ? '---\n' : ''}![image](${s})\n`).join('')
    if (this.presentation) {
      this.presentation.nativeElement.innerHTML = `<div class="reveal">
        <div class="slides">
          <section data-markdown data-separator="---">
            <script type="text/template">${this.file}</script>
          </section>
        </div>
      </div>`
    }

    setTimeout(() => {
      this.initReveal()
    }, 100)
  }

  onFileUpload(fileContent: string) {
    this.slidesService.parseSlides(fileContent)
    if (this.slidesService.slides.length) {
      this.initPresentation()
    }
  }
}
