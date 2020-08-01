import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable()
export class SearchService {

  constructor() { }

  private textToSearchSource   = new Subject<string>();

  textToSearch$ = this.textToSearchSource.asObservable();

  search(text: string) {
    this.textToSearchSource.next(text);
  }

  clear(){
    this.textToSearchSource.next("")
  }

}
