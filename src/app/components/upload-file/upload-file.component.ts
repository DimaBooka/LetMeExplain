import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core'

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  @ViewChild("fileDropRef", { static: false }) fileDropEl?: ElementRef;

  @Input() small = false
  @Output() fileUpload: EventEmitter<File> = new EventEmitter<File>()

  /**
   * Convert Event to file
   *
   * @param uploadFile (Event)
   */
  fileBrowseHandler(uploadFile: Event) {
    const file = (<any>uploadFile.target)?.files?.[0]
    if (file) {
      this.fileUpload.emit(file)
    }
  }
}
