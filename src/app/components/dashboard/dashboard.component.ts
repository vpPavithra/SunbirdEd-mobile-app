import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Environment, ID, InteractType, PageId } from '../../../services/telemetry-constants';
import { CommonUtilService } from '../../../services/common-util.service';
import { TelemetryGeneratorService } from '../../../services/telemetry-generator.service';
import { StoragePermissionHandlerService } from '../../../services/storage-permission/storage-permission-handler.service';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@capacitor-community/file-opener';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import 'datatables.net-fixedcolumns';
@Component({
  selector: 'dashboard-component',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Input() dashletData: any;
  @Input() collectionName: string;
  DashletRowData = { values: [] };
  columnConfig = {
    columnConfig: [],
  };


  @ViewChild('lib', { static: false }) lib: any;

  constructor(
    private storagePermissionHandlerService: StoragePermissionHandlerService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private file: File,
    private platform: Platform
  ) {

  }

  ngOnInit() {
    this.DashletRowData.values = this.dashletData.rows;
    this.columnConfig.columnConfig = this.dashletData.columns;
  }


  async exportCsv() {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.DOWNLOAD_CLICKED,
      undefined,
      Environment.GROUP,
      PageId.ACTIVITY_DASHBOARD,
      undefined,
      undefined,
      undefined,
      undefined,
      ID.DOWNLOAD_CLICKED
    );
    const appName = await (await App.getInfo()).name;
    await this.storagePermissionHandlerService.checkForPermissions(PageId.ACTIVITY_DASHBOARD).then(async (result) => {
      if (result) {
        const expTime = new Date().getTime();
        const filename = this.collectionName.trim() + '_' + expTime + '.csv';
        const downloadDirectory = this.platform.is('ios') ? `${cordova.file.documentsDirectory}Download/` : cordova.file.externalDataDirectory

        this.lib.instance.exportCsv({ 'strict': true }).then((csvData) => {
          console.log('exportCSVdata', csvData);
          this.file.writeFile(downloadDirectory, filename, csvData, { replace: true })
            .then((res) => {
              console.log('rs write file', res);
              this.openCsv(res.nativeURL);
              this.commonUtilService.showToast(
                this.commonUtilService.translateMessage('DOWNLOAD_COMPLETED', filename), false, 'custom-toast');
            })
            .catch((err) => {
              this.writeFile(downloadDirectory, csvData);
              console.log('writeFile err', err);
            });
        }).catch((err) => {
          console.log('checkForPermissions err', err);
        });

      } else {
        await this.commonUtilService.showSettingsPageToast('FILE_MANAGER_PERMISSION_DESCRIPTION', appName, PageId.ACTIVITY_DASHBOARD, true);
      }
    });
  }

  openCsv(path) {
    FileOpener.open({filePath: path, contentType: 'text/csv'})
      .then(() => console.log('File is opened'))
      .catch((e) => {
        console.log('Error opening file', e);
        this.commonUtilService.showToast('CERTIFICATE_ALREADY_DOWNLOADED');
      });
  }

  writeFile(downloadDirectory: string, csvData: any) {
    const fileName = `course_${new Date().getTime()}`;
    this.file.writeFile(downloadDirectory, fileName, csvData, { replace: true })
      .then((res) => {
        console.log('rs write file', res);
        this.openCsv(res.nativeURL);
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('DOWNLOAD_COMPLETED', fileName), false, 'custom-toast');
      })
      .catch((err) => {
        console.log('writeFile err', err);
      });
  }

}
