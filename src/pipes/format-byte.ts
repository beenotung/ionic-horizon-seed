import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {format_byte} from "../../lib/tslib/src/format";

/*
 Generated class for the FormatByte pipe.

 See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 Angular 2 Pipes.
 */
@Pipe({
  name: 'format_byte'
  , pure: true
})
@Injectable()
export class FormatByte implements PipeTransform {
  /*_byte
   Takes a value and makes it lowercase.

   */
  /**
   * take a number (of byte) and make it a formatted string
   * */
  transform(n_byte: number) {
    return format_byte(n_byte);
  }
}
