import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { FormUploadControl } from '../../controls';
import { FormUploadItem } from '../../models';

@Component({
  selector: 'app-form-upload',
  templateUrl: 'form-upload.component.html',
  styleUrls: ['form-upload.component.scss']
})
export class FormUploadComponent {
  @ViewChild('input') input: ElementRef;
  @Input() id = `formUpload-${Date.now()}`;
  @Input() label: string;
  @Input() control: FormUploadControl;

  constructor(
    private readonly sanitizer: DomSanitizer
  ) {

  }

  public get allowedExtensions(): string {
    return this.control.allowedExtensions.join(', ');
  }

  public get maxFileSize(): string {
    return `${this.control.maxFileSize / 1024 / 1024}MB`;
  }

  public get isEmpty(): boolean {
    const value: FormUploadItem[] = this.control.value;
    return !value.length || value.every(file => file.removed);
  }

  public onChange(files: FileList): void {
    const items = Array.from(files).map(file => {
      const item = new FormUploadItem(file);
      item.markAsUpdated();
      return item;
    });

    this.control.preValidate(items);
    if (!this.control.preValid) {
      this.clearInput();
      return;
    }

    this.control.setValue(items);
  }

  public getPreview(file: File): SafeUrl {
    const url = window.URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public getFileSize(file: File): string {
    return `${Math.round((file.size / 1024 / 1024) * 100) / 100}MB`;
  }

  public clear(): boolean {
    const items: FormUploadItem[] = this.control.value;
    items.forEach(item => item.markAsRemoved());
    this.control.setValue(items);
    this.clearInput();
    return false;
  }

  private clearInput(): void {
    const inputElement = this.input.nativeElement as HTMLInputElement;
    inputElement.value = '';
  }
}
