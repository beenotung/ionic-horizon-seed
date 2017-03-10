import {Counter} from "../../../lib/tslib/src/uuid";
import {Random} from "../../../lib/tslib/src/random";
import {fromFileList, last} from "../../../lib/tslib/src/array";
import {str_contains} from "../../../lib/tslib/src/string";
export class DocumentFile {
  id: number;
  name: string;
  type: DocumentFile.Type;
  size: number;
}
export namespace DocumentFile {
  export enum Type{
    unknown
      , pdf
      , word
      , plaintext
      , spreadsheet
      , presentation_slide
      , adobe_illustrator
      , photoshop
      , image
      , archive
  }
  export const icons = new Map<Type, string>();
  {
    icons.set(Type.unknown, 'https://image.flaticon.com/icons/svg/339/339015.svg');
    icons.set(Type.pdf, 'https://image.flaticon.com/icons/png/512/179/179483.png');
    icons.set(Type.word, 'https://image.flaticon.com/icons/png/512/236/236654.png');
    icons.set(Type.plaintext, icons.get(Type.word));
    icons.set(Type.spreadsheet, 'https://image.flaticon.com/icons/svg/179/179495.svg');
    icons.set(Type.presentation_slide, 'https://image.flaticon.com/icons/svg/218/218535.svg');
    icons.set(Type.adobe_illustrator, 'https://image.flaticon.com/icons/svg/179/179464.svg');
    icons.set(Type.photoshop, 'https://image.flaticon.com/icons/svg/179/179486.svg');
    icons.set(Type.image, 'https://image.flaticon.com/icons/svg/148/148711.svg');
    icons.set(Type.archive, 'https://image.flaticon.com/icons/svg/130/130994.svg');
  }
  export const SAMPLES: DocumentFile[] = [
    {
      name: 'Proposal Presentation.ppt'
      , type: DocumentFile.Type.presentation_slide
    }
    , {
      name: 'Proposal Report.docx'
      , type: DocumentFile.Type.word
    }
    , {
      name: 'Business Plan.doc'
      , type: DocumentFile.Type.word
    }
    , {
      name: 'Prototype.svg'
      , type: DocumentFile.Type.image
    }
    , {
      name: 'Design.ai'
      , type: DocumentFile.Type.adobe_illustrator
    }
    , {
      name: 'Timeline.xlsx'
      , type: DocumentFile.Type.spreadsheet
    }
    , {
      name: 'Market Research Report.pdf'
      , type: DocumentFile.Type.pdf
    }
    , {
      name: 'Business Plan.odt'
      , type: DocumentFile.Type.word
    }
  ]
    .map(x => Object.assign({
      id: Counter.next()
      , size: Random.nextInt(250 * 1024, 100 * 1024)
    }, x));

  export function getType(file: File): Type {
    console.log('getType', file.type);
    let ext = last(file.name.split('.'));
    if (ext == 'pdf' || file.type.endsWith('pdf'))
      return Type.pdf;
    if (str_contains('image', file.type))
      return Type.image;
    if (ext == 'ppt')
      return Type.presentation_slide;
    if (ext == 'doc' || ext == 'docx' || ext == 'odt')
      return Type.word;
    if (file.type.startsWith('text'))
      return Type.plaintext;
    if (str_contains('sheet', file.type))
      return Type.spreadsheet;
    return Type.unknown;
  }

  export async function uploadFiles(files: FileList): Promise<DocumentFile[]> {
    let requests = fromFileList(files)
      .map(file => {
        let res = new DocumentFile();
        res.id = Counter.next();
        res.name = file.name;
        res.type = getType(file);
        console.log('file type', Type[res.type]);
        res.size = file.size;
        return res;
      });
    return Promise.all(requests);
  }
}
