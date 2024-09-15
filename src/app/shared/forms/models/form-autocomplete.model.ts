import { DeviceType } from '@app/core';
export interface FormAutocompleteItem {
  id?: number;
  name: string;
  helperData: string;
  type?: DeviceType;
  value?: any;
}
