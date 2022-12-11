import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core'

import Reveal  from 'reveal.js'
import RevealMarkdown  from 'reveal.js/plugin/markdown/markdown'


@Component({
  selector: 'app-view-explanation',
  templateUrl: './view-explanation.component.html',
  styleUrls: ['./view-explanation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewExplanationComponent {

  @ViewChild('presentation') presentation?: ElementRef

  file?: string
  error?: string

  constructor(private cdr: ChangeDetectorRef) {}

  initReveal() {
    Reveal.initialize({
      plugins: [RevealMarkdown]
    })
  }

  onFileUpload(file: File) {
    this.error = undefined

    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = (e) => {
      this.file = <string>e.target?.result

      if (this.presentation) {
        this.presentation.nativeElement.innerHTML = `<div class="reveal">
          <div class="slides">
            <section data-markdown data-separator="---">
              <script type="text/template">${this.file}</script>
            </section>
          </div>
        </div>`
      }
      this.cdr.detectChanges()

      // setTimeout(() => {
        this.initReveal()
        this.cdr.markForCheck()
      // }, 50)
    }
    reader.onerror = (e) => {
      this.error = 'error reading file'
      this.cdr.markForCheck()
    }
  }
}
