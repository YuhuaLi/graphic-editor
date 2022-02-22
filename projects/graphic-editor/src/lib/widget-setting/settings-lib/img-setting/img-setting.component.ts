import { Component, ComponentRef, OnInit } from '@angular/core';
import { WidgetData } from '../../../model';
import { WidgetComponent } from '../../../widget-lib/widget/widget.component';

export type ImgSetting = {
  imgSrc?: string | null;
};

@Component({
  selector: 'lib-img-setting',
  templateUrl: './img-setting.component.html',
  styleUrls: ['./img-setting.component.scss'],
})
export class ImgSettingComponent implements OnInit {
  uploadPath = '';

  constructor(public ref: ComponentRef<WidgetComponent>) {}

  ngOnInit(): void {}

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && /^image\/.*$/.test(file.type)) {
      this.loadFile(file);
    }
  }

  onUploadImage(event: Event): void {
    const file = ((event.target as HTMLInputElement).files || [])[0];
    if (file && /^image\/.*$/.test(file.type)) {
      this.loadFile(file);
    }
  }

  loadFile(file: File): void {
    const fr = new FileReader();
    fr.onload = () => {
      (this.ref.instance.widgetData as WidgetData<ImgSetting>).setting.imgSrc =
        fr.result as string;
    };
    fr.onerror = () => (this.uploadPath = '');
    fr.readAsDataURL(file);
  }

  deleteImage(): void {
    this.uploadPath = '';
    (this.ref.instance.widgetData as WidgetData<ImgSetting>).setting.imgSrc =
      '';
  }
}
