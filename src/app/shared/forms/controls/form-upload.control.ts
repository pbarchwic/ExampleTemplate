import { FormControl, ValidatorFn, AbstractControlOptions, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { FormUploadItem } from '../models';

export enum PreValidationStatus {
  Invalid = 1,
  Valid = 2
}

export class FormUploadControl extends FormControl {
  public readonly allowedExtensions: string[];
  public readonly allowedMimeTypes: string[];
  public readonly maxFileSize: number;
  public readonly maxFiles: number;

  private preErrors: ValidationErrors | null;
  private preStatus: PreValidationStatus = PreValidationStatus.Valid;

  constructor(
    allowedMimeTypes: string[],
    allowedExtensions: string[],
    maxFileSize: number,
    maxFiles: number,
    formState?: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(formState, validatorOrOpts, asyncValidator);
    this.allowedMimeTypes = allowedMimeTypes;
    this.allowedExtensions = allowedExtensions;
    this.maxFileSize = maxFileSize;
    this.maxFiles = maxFiles;
  }

  public get preInvalid(): boolean {
    return this.preStatus === PreValidationStatus.Invalid;
  }

  public get preValid(): boolean {
    return this.preStatus === PreValidationStatus.Valid;
  }

  public preValidate(items: FormUploadItem[]): void {
    const clonedControl = this.cloneControl();
    clonedControl.setValue(items);
    this.preErrors = clonedControl.errors;
    this.preStatus = this.preErrors === null
      ? PreValidationStatus.Valid
      : PreValidationStatus.Invalid;
  }

  public clearPreValidate(): void {
    this.preErrors = null;
    this.preStatus = PreValidationStatus.Valid;
  }

  public hasPreError(name: string): boolean {
    return !!this.preErrors && !!this.preErrors[name];
  }

  private cloneControl(): FormUploadControl {
    return new FormUploadControl(this.allowedMimeTypes, this.allowedExtensions,
      this.maxFileSize, this.maxFiles, undefined, this.validator, this.asyncValidator);
  }
}
