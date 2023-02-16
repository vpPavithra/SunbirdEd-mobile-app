import { TestBed } from '@angular/core/testing';
import { DownloadPdfService } from './download-pdf.service';
import { Injectable } from '@angular/core';
import { AndroidPermissionsService } from '../android-permissions/android-permissions.service';
import { AndroidPermission } from '@app/services/android-permissions/android-permission';
import { of } from 'rxjs';
import { content, checkedStatusFalse, requestedStatusTrue, downloadrequested } from './download-pdf.data';
import { Content } from '@project-sunbird/sunbird-sdk';

describe('DownloadPdfService', () => {
  let downloadPdfService: DownloadPdfService;
  const mockPermissionService: Partial<AndroidPermissionsService> = {
    checkPermissions: jest.fn(() => of(Boolean)),
    requestPermissions: jest.fn(() => of(Boolean))
  };

  beforeAll(() => {
    downloadPdfService = new DownloadPdfService(
      mockPermissionService as AndroidPermissionsService
    );
  //  jest.spyOn(mockPermissionService, 'checkPermissions')
  //  jest.spyOn(mockPermissionService, 'requestPermissions')
   jest.spyOn(window['downloadManager'], 'enqueue')
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });


  it('should be created', () => {
    expect(downloadPdfService).toBeTruthy();
  });
  describe('if permission is always denied', () => {
    beforeAll(() => {
      mockPermissionService.checkPermissions = jest.fn(() => of({isPermissionAlwaysDenied: true }))
    })
    it('it should reject', async () => {
      try {
        await downloadPdfService.downloadPdf(content as any as Content);
        fail();
      } catch (e) {
        setTimeout(() => {
        expect(e).toEqual({ reason: 'device-permission-denied' });
          
        }, 50);
        // done();
      }
    });
  });

  describe('if permission is not always denied', () => {
    beforeAll(() => {
      mockPermissionService.checkPermissions = jest.fn(() => of({ isPermissionAlwaysDenied: false }));
    });

    describe('if permission is not allowed', () => {

      describe('if permission granted', () => {
        beforeAll(() => {
          mockPermissionService.checkPermissions = jest.fn(() => of({ isPermissionAlwaysDenied: false, hasPermission: false }));
          mockPermissionService.requestPermissions = jest.fn(() => of({ isPermissionAlwaysDenied: false, hasPermission: true }));
          window['downloadManager']['enqueue'] = jest.fn((downloadRequest, callback) => {
            callback(null, 'sampleid');
          });

        })
        it('should download pdf', async () => {
          try {
            jest.setTimeout(50);
            await downloadPdfService.downloadPdf(content as any as Content);
            expect(window['downloadManager'].enqueue).toHaveBeenCalled();
            // done();
          } catch (e) {
            fail(e);
          }
        });
      });

      describe('if permission not granted', () => {
        beforeAll(() => {
          mockPermissionService.checkPermissions = jest.fn(() => of({ isPermissionAlwaysDenied: false, hasPermission: false }));
          mockPermissionService.requestPermissions = jest.fn(() => of({ isPermissionAlwaysDenied: false, hasPermission: false }));
        })
        it('should reject ', async () => {
          try {
            await downloadPdfService.downloadPdf(content as any as Content);
            fail();
          } catch (e) {
            jest.setTimeout(50);
            setTimeout(() => {
              expect(e).toEqual({ reason: 'user-permission-denied' });
            }, 10);
            // done();
          }
        });
      });
    });
  });
});
