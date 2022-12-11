import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core'

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  @ViewChild("fileDropRef", { static: false }) fileDropEl?: ElementRef;

  @Input() small = false
  @Output() fileContent: EventEmitter<string> = new EventEmitter<string>()

  /**
   * Convert Event to file
   *
   * @param uploadFile (Event)
   */
  fileBrowseHandler(uploadFile: Event) {
    const file = (<any>uploadFile.target)?.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onload = (e) => {
        const fileContent = <string>e.target?.result

        this.fileContent.emit(fileContent)
      }
      reader.onerror = (e) => {
        // TODO: show error
        // this.error = 'error reading file'
      }
    }
  }
}
