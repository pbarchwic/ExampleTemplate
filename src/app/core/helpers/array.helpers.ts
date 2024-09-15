export class ArrayHelpers {
  public static sortByProperty<T, K extends keyof T>(array: T[], property: K): T[] {
    if (!array || !array.length) {
      return array;
    }

    return array.sort((a, b) => ((a[property] as unknown) as string).localeCompare((b[property] as unknown) as string));
  }

  public static filterByProperty<T, K extends keyof T>(array: T[], property: K, value: T[K]): T[] {
    if (!array || !array.length) {
      return array;
    }

    return array.filter((item) => (item[property] as unknown) === value);
  }
}
