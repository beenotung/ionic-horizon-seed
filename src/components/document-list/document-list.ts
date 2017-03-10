import {Component, Input} from '@angular/core';
import {IonTable} from "../ion-table/ion-table";
import {DocumentFile} from "../../model/api/documentFile";
import {format_byte} from "../../../lib/tslib/src/format";

/*
 Generated class for the DocumentList component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'document-list',
  templateUrl: 'document-list.html'
})
export class DocumentListComponent {

  @Input()
  document_files: DocumentFile[];

  constructor() {
    console.log('Hello DocumentList Component');
  }

  filetype_icon(documentFile: DocumentFile): string {
    return DocumentFile.icons.get(documentFile.type)
      || DocumentFile.icons.get(DocumentFile.Type.unknown)
  }

  datum_to_cols(document: DocumentFile): IonTable.TableCol[] {
    return [
      document.type
      , document.name
      , format_byte(document.size)
      , 'Download'
    ]
  }

  upload_file(files: FileList) {
    console.log('upload files', files);
    DocumentFile.uploadFiles(files)
      .then(files => {
        console.log('upload finished', files);
        this.document_files.push(...files);
      })
  }
}
