import { Injectable, Output, EventEmitter } from '@angular/core';
@Injectable()
export class ChartsService {

  @Output() change: EventEmitter<any> = new EventEmitter();

  public filterTable(filterText: any) {
    this.change.emit(filterText);
  }

}