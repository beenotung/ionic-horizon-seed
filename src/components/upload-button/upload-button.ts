import {Component, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild} from '@angular/core';

/*
 Generated class for the UploadButton component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'upload-button',
  templateUrl: 'upload-button.html'
})
export class UploadButtonComponent {

  @Input()
  text: string;

  @Input()
  multiple: boolean;

  @Output()
  addFiles = new EventEmitter();

  @ViewChild("input")
  navtiveBtnRef: ElementRef;

  constructor(private renderer: Renderer) {
    console.log('Hello UploadButton Component');
  }

  selectFile() {
    let event = new MouseEvent("click", {bubbles: true});
    this.renderer.invokeElementMethod(
      this.navtiveBtnRef.nativeElement
      , "dispatchEvent"
      , [event]
    );
  }

  addFile($event: Event) {
    let files: FileList = this.navtiveBtnRef.nativeElement.files;
    this.addFiles.emit(files);
  }
}
