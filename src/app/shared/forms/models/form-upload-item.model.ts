export class FormUploadItem {
  public preview: string;
  public file: File | Blob;
  public removed = false;
  public updated = false;

  constructor(file: File | Blob) {
    this.file = file;
    this.preview = window.URL.createObjectURL(file);
  }

  public markAsRemoved(): void {
    this.removed = true;
    this.updated = false;
  }

  public markAsUpdated(): void {
    this.updated = true;
    this.removed = false;
  }
}
