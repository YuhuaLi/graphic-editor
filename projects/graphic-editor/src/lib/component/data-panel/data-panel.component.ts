import {
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DATA_TYPE_LIST } from '../../const';
import { DataType } from '../../enum';
import { DataSetting } from '../../type';
import { WidgetComponent } from '../../widget-lib/widget/widget.component';

@Component({
  selector: 'ng-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss'],
})
export class DataPanelComponent implements OnInit {
  @Input() dataSetting!: DataSetting;
  @Input() ref?: ComponentRef<WidgetComponent>;
  @Output() settingChange = new EventEmitter<DataSetting>();
  @Output() delete = new EventEmitter<DataSetting>();

  titleReadonly = true;
  dataTypeList = DATA_TYPE_LIST;
  dataType = DataType;
  pageDataList: { name: string; value: any }[] = [];

  ngOnInit(): void {
    if (!this.ref) {
      this.dataTypeList = this.dataTypeList.filter(
        (item) => item.value !== DataType.PageData
      );
    } else if (this.ref) {
      this.pageDataList = (this.ref.instance.page.dataSetting || []).map(
        (item) => ({
          name: item.name,
          value: item.id,
        })
      );
    }
  }

  deleteDataSetting(): void {
    this.delete.emit(this.dataSetting);
  }

  onPageSettingChange(setting: number): void {
    this.dataSetting.parent = setting;
    this.emitChange();
  }

  onSettingTypeChange(type: DataType): void {
    if (
      this.dataSetting.type !== DataType.PageData &&
      type !== DataType.PageData
    ) {
      this.dataSetting.type = type;
      this.dataSetting.parent = undefined;
      this.dataSetting.apiUrl =
        type !== DataType.Api ? undefined : this.dataSetting.apiUrl;
      this.dataSetting.interval =
        type !== DataType.Api ? undefined : this.dataSetting.interval;
      this.dataSetting.polling =
        type !== DataType.Api ? undefined : this.dataSetting.polling;
      this.dataSetting.const =
        type !== DataType.Const ? undefined : this.dataSetting.const;
    } else {
      this.dataSetting.type = type;
      this.dataSetting.parent = undefined;
      this.dataSetting.apiUrl = undefined;
      this.dataSetting.interval = undefined;
      this.dataSetting.polling = undefined;
      this.dataSetting.const = undefined;
    }
    this.emitChange();
  }

  emitChange(): void {
    this.settingChange.emit(this.dataSetting);
  }

}
