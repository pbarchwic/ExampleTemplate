import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseErrorMessage',
})
export class ParseErrorMessagePipe implements PipeTransform {
  public transform(value: string): string {
    if (typeof value !== 'string') {
      return value;
    }

    const parsedValue = value.trim().replace(/\s/g, '_').toLowerCase();
    return `api_error_messsage_${parsedValue}`;
  }
}
