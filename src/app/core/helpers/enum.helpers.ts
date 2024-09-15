export class EnumHelpers {
  public static toArray<T>(enumObject: any): T[] {
    const arr = [];
    for (const key in enumObject) {
      if (enumObject.hasOwnProperty(key)) {
        arr.push(enumObject[key]);
      }
    }

    return arr;
  }
}
