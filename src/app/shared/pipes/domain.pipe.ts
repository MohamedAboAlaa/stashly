import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'domain'
})
export class DomainPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    if (!value.startsWith('https://') && !value.startsWith('http://')) {
      value = 'https://' + value;
    }

    try {
      const url = new URL(value);

      const host = url.hostname;

      if (host.startsWith('www.')) {
        host.replace('www.', '');
      }

      return host;

    } catch (e) {
      return value;
    }
  }
}
