import { Directive, Output, EventEmitter, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appFileDrop]'
})
export class FileDropDirective {
  @Output() dropped = new EventEmitter<FileList>();

  @HostBinding('style.opacity') opacity = '1';
  @HostBinding('class.drop-over') dropOver = false;

  @HostListener('dragover', ['$event'])
  public over(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.opacity = '0.5';
    this.dropOver = true;
  }

  @HostListener('dragleave', ['$event'])
  public leave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.opacity = '1';
    this.dropOver = false;
  }

  @HostListener('drop', ['$event'])
  public drop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.opacity = '1';
    this.dropOver = false;
    this.dropped.emit(event.dataTransfer.files);
  }
}
