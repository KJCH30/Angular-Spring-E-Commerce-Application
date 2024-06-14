import { Directive, HostBinding, HostListener, Output } from '@angular/core';
import { ImageHandle } from './_model/image-handle.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {

  @Output() files: EventEmitter<ImageHandle> = new EventEmitter();

  @HostBinding("style.background") private background = "#eee";

  constructor(private sanitizer: DomSanitizer) { }

  @HostListener("dragover", ["$event"])
  public onDragOver(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.background = "#999";
  }

  @HostListener("dragleave", ["$event"])
  public onDragLeave(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.background = "#eee";
  }

  @HostListener("drop", ["$event"])
  public onDrop(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.background = "#eee";

    const image_file = event.dataTransfer?.files[0];
    if (image_file) {
      const url: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(image_file));
      const imageHandle: ImageHandle = { image_file, url };
      this.files.emit(imageHandle);
    }
  }
}
