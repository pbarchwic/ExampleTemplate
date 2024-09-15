import { Injectable } from "@angular/core";

@Injectable()
export class ConfigService {
  public readonly appName = "example App";
  public readonly allowedMimeTypes = [
    "image/png",
    "image/jpeg",
    "application/octet-stream",
  ];
  public readonly allowedFileExtensions = [".png", ".jpeg", ".jpg"];
  public readonly maxFileSize = 5242880;
}
