export class BaseViewModel {
  constructor(data: object) {
    Object.keys(data).forEach((key: string) => this[key] = data[key]);
  }
}
