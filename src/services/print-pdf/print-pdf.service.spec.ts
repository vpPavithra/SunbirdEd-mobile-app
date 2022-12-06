import { TestBed } from '@angular/core/testing';
import { CommonUtilService } from '../common-util.service';

import { PrintPdfService } from './print-pdf.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { throwError } from 'rxjs';


describe('PrintPdfService', () => {
  let printPdfService: PrintPdfService;
  const mockCommonUtilService: Partial<CommonUtilService> = {};
  const mockTransfer: Partial<FileTransfer> = {};

  beforeAll(() => {
    printPdfService = new PrintPdfService(
      mockCommonUtilService as CommonUtilService,
      mockTransfer as FileTransfer
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });


  it('should be created', () => {
    expect(printPdfService).toBeTruthy();
  });

  it('should print pdf', (done) => {
    // arrange
    //    const content: Partial<Content> = {
    //     contentData: {
    //         itemSetPreviewUrl: 'http://some_domain.com/som_path.some_extension'
    //     }
    // };
    const url = 'downloadUrl';
    const mockPresent = jest.fn(() => Promise.resolve());
    const mockDismiss = jest.fn(() => Promise.resolve());
    const mockDownload = jest.fn(() => Promise.resolve({
      toURL: () => 'SOME_TEMP_URL'
    }));
    mockCommonUtilService.getLoader = jest.fn(() => {
      return Promise.resolve({
        present: mockPresent,
        dismiss: mockDismiss
      });
    });
    mockCommonUtilService.showToast = jest.fn(() => { });
    mockTransfer.create = jest.fn(() => ({ 
      // // return {
        download: mockDownload
      // };
    })) as any;
    window.cordova.plugins.printer.canPrintItem = jest.fn((_, cb) => { cb(true); });
    window.cordova.plugins.printer.print = jest.fn();
    // act
    printPdfService.printPdf(url);
    setTimeout(() => {
      expect(mockTransfer.create).toHaveBeenCalled();
      // expect(mockDownload).toHaveBeenCalledWith(content.contentData.itemSetPreviewUrl, expect.any(String));
      expect(window.cordova.plugins.printer.print).toHaveBeenCalledWith('SOME_TEMP_URL');
      done()
    }, 0)
  })
  it('should show toast on can print item false', (done) => {
    // arrange
    const url = 'downloadUrl';
    const mockPresent = jest.fn(() => Promise.resolve());
    const mockDismiss = jest.fn(() => Promise.resolve());
    const mockDownload = jest.fn(() => Promise.resolve({
      toURL: () => 'SOME_TEMP_URL'
    }));
    mockCommonUtilService.getLoader = jest.fn(() => {
      return Promise.resolve({
        present: mockPresent,
        dismiss: mockDismiss
      });
    });
    mockCommonUtilService.showToast = jest.fn(() => { });
    mockTransfer.create = jest.fn(() => ({ 
      // // return {
        download: mockDownload
      // };
    })) as any;
    window.cordova.plugins.printer.canPrintItem = jest.fn((_, cb) => { cb(false); });
    // act
    printPdfService.printPdf(url);
    setTimeout(() => {
      expect(mockTransfer.create).toHaveBeenCalled();
      expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('ERROR_COULD_NOT_OPEN_FILE');
      done()
    }, 0)
  });

  it('should show toast on error', (done) => {
    // arrange
    const url = 'downloadUrl';
    const mockPresent = jest.fn(() => Promise.resolve());
    const mockDismiss = jest.fn(() => Promise.resolve());
    mockCommonUtilService.getLoader = jest.fn(() => {
      return Promise.resolve({
        present: mockPresent,
        dismiss: mockDismiss
      });
    });
    mockCommonUtilService.showToast = jest.fn(() => { });
    mockTransfer.create = jest.fn(() => throwError({ 
    })) as any;
    window.cordova.plugins.printer.canPrintItem = jest.fn((_, cb) => { cb(false); });
    // act
    printPdfService.printPdf(url);
    setTimeout(() => {
      expect(mockTransfer.create).toHaveBeenCalled();
      expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('ERROR_COULD_NOT_OPEN_FILE');
      done()
    }, 0)
  })
});