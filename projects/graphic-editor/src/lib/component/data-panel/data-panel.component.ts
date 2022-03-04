import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DATA_TYPE_LIST } from '../../const';
import { DataType } from '../../enum';
import { DataSetting } from '../../type/data-setting.type';

@Component({
  selector: 'lib-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss'],
})
export class DataPanelComponent implements OnInit {
  @Input() dataSetting!: DataSetting;
  @Output() delete = new EventEmitter<DataSetting>();

  titleReadonly = true;
  dataTypeList = DATA_TYPE_LIST;
  dataType = DataType;

  constructor() {}

  ngOnInit(): void {}

  deleteDataSetting(): void {
    this.delete.emit(this.dataSetting);
  }

  onPollingChange(event: boolean): void {
    console.log(event, this.dataSetting);
  }
}
