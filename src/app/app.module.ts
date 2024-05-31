// Angular dependencies
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
// ionic cordova dependencies/plugins
// import { Camera } from '@awesome-cordova-plugins/camera/ngx';
// import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
// import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
// import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';
// import { NativePageTransitions } from '@awesome-cordova-plugins/native-page-transitions/ngx';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
// 3rd party dependencies
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// app dependencies like directive, sdk, services etc
import { CsContentType } from '@project-sunbird/client-services/services/content';
import { SunbirdSdk } from '@project-sunbird/sunbird-sdk';
// Services
import { SegmentationTagService } from '../services/segmentation-tag/segmentation-tag.service';
import { QumlPlayerService } from '../services/quml-player/quml-player.service';
import { DirectivesModule } from '../directives/directives.module';
import { AppGlobalService } from '../services/app-global-service.service';
import { FormAndFrameworkUtilService } from '../services/formandframeworkutil.service';
import { CourseUtilService } from '../services/course-util.service';
import { TelemetryGeneratorService } from '../services/telemetry-generator.service';
import { QRScannerResultHandler } from '../services/qrscanresulthandler.service';
import { SunbirdQRScanner } from '../services/sunbirdqrscanner.service';
import { CommonUtilService } from '../services/common-util.service';
import { LogoutHandlerService } from '../services/handlers/logout-handler.service';
import { LoginHandlerService } from '../services/login-handler.service';
import { ContainerService } from '../services/container.services';
import { UtilityService } from '../services/utility-service';
import { AppHeaderService } from '../services/app-header.service';
import { AppRatingService } from '../services/app-rating.service';
import { CollectionService } from '../services/collection.service';
import { AndroidPermissionsService } from '../services/android-permissions/android-permissions.service';
import { ComingSoonMessageService } from '../services/coming-soon-message.service';
import { ActivePageService } from '../services/active-page/active-page-service';
import { CanvasPlayerService } from '../services/canvas-player.service';
import { SplashScreenService } from '../services/splash-screen.service';
import { GroupHandlerService } from '../services/group/group-handler.service';
import { ContentAggregatorHandler } from '../services/content/content-aggregator-handler.service';
import { NotificationService } from '../services/notification.service';
import { TncUpdateHandlerService } from '../services/handlers/tnc-update-handler.service';
import {
  SplashcreenTelemetryActionHandlerDelegate
} from '../services/sunbird-splashscreen/splashcreen-telemetry-action-handler-delegate';
import { SplashscreenImportActionHandlerDelegate } from '../services/sunbird-splashscreen/splashscreen-import-action-handler-delegate';
import { SplaschreenDeeplinkActionHandlerDelegate } from '../services/sunbird-splashscreen/splaschreen-deeplink-action-handler-delegate';
import { LocalCourseService } from '../services/local-course.service';
import { ExternalIdVerificationService } from '../services/externalid-verification.service';
import { NavigationService } from '../services/navigation-handler.service';
import { ConsentService } from '../services/consent-service';
import { ProfileHandler } from '../services/profile-handler';
import { DownloadPdfService } from '../services/download-pdf/download-pdf.service';
import { LocationHandler } from '../services/location-handler';
import { DiscussionTelemetryService } from '../services/discussion/discussion-telemetry.service';
import { CrashAnalyticsErrorLogger } from '../services/crash-analytics/crash-analytics-error-logger';
import { PrintPdfService } from '../services/print-pdf/print-pdf.service';
import { UpdateProfileService } from '../services/update-profile-service';
import { OnboardingConfigurationService } from '../services/onboarding-configuration.service';
import { LoginNavigationHandlerService } from '../services/login-navigation-handler.service';
import { StoragePermissionHandlerService } from '../services/storage-permission/storage-permission-handler.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouteReuseStrategy } from '@angular/router';
// import { IonicStorageModule } from '@ionic/storage';
import { buildConfig, configuration } from '../../configurations/configuration';
// Components
import { ComponentsModule } from './components/components.module';
import { PageFilterOptionsPageModule } from './page-filter/page-filter-options/page-filter-options.module';
import { PageFilterPageModule } from './page-filter/page-filter.module';
import { TermsAndConditionsPageModule } from './terms-and-conditions/terms-and-conditions.module';
import { TextbookTocService } from '../app/collection-detail-etb/textbook-toc-service';
import { AliasBoardName } from '../pipes/alias-board-name/alias-board-name';
// import {configuration} from '../configuration/configuration';
// import { CoreModule } from './manage-learn/core/core.module';
import { UserTypeSelectionPageModule } from './user-type-selection/user-type-selection.module';
import { SbSearchFilterModule } from 'common-form-elements';
import { TranslateJsonPipe } from '../pipes/translate-json/translate-json';
import onboarding from './../assets/configurations/config.json';
import { SplashScreen } from '@capacitor/splash-screen';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SuiRatingModule} from '@project-sunbird/ng2-semantic-ui';
// AoT requires an exported function for factories
export function translateHttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export const authService = () => {
  return SunbirdSdk.instance.authService;
};
export const pageAssembleService = () => {
  return SunbirdSdk.instance.pageAssembleService;
};
export const dbService = () => {
  return SunbirdSdk.instance.dbService;
};
export const courseService = () => {
  return SunbirdSdk.instance.courseService;
};
export const sharedPreferences = () => {
  return SunbirdSdk.instance.sharedPreferences;
};
export const apiService = () => {
  return SunbirdSdk.instance.apiService;
};
export const profileService = () => {
  return SunbirdSdk.instance.profileService;
};
export const deviceRegisterService = () => {
  return SunbirdSdk.instance.deviceRegisterService;
};
export const groupService = () => {
  return SunbirdSdk.instance.groupService;
};
export const frameworkService = () => {
  return SunbirdSdk.instance.frameworkService;
};
export const frameworkUtilService = () => {
  return SunbirdSdk.instance.frameworkUtilService;
};
export const systemSettingsService = () => {
  return SunbirdSdk.instance.systemSettingsService;
};
export const telemetryService = () => {
  return SunbirdSdk.instance.telemetryService;
};
export const contentService = () => {
  return SunbirdSdk.instance.contentService;
};
export const contentFeedbackService = () => {
  return SunbirdSdk.instance.contentFeedbackService;
};
export const eventsBusService = () => {
  return SunbirdSdk.instance.eventsBusService;
};
export const deviceInfo = () => {
  return SunbirdSdk.instance.deviceInfo;
};
export const playerService = () => {
  return SunbirdSdk.instance.playerService;
};
export const formService = () => {
  return SunbirdSdk.instance.formService;
};
export const downloadService = () => {
  return SunbirdSdk.instance.downloadService;
};

export function storageService() {
  return SunbirdSdk.instance.storageService;
}
export function notificationService() {
  return SunbirdSdk.instance.notificationService;
}
export function errorLoggerService() {
  return SunbirdSdk.instance.errorLoggerService;
}
export function searchHistoryService() {
  return SunbirdSdk.instance.searchHistoryService;
}
export function networkInfoService() {
  return SunbirdSdk.instance.networkInfoService;
}
export function codePushExperimentService() {
  return SunbirdSdk.instance.codePushExperimentService;
}
export function faqService() {
  return SunbirdSdk.instance.faqService;
}
export function archiveService() {
  return SunbirdSdk.instance.archiveService;
}
export const discussionService = () => {
  return SunbirdSdk.instance.discussionService;
};
export const segmentationService = () => {
  return SunbirdSdk.instance.segmentationService;
};

export const debuggingService = () => {
  return SunbirdSdk.instance.debuggingService;
};

export const notificationServiceV2 = () => {
  return SunbirdSdk.instance.notificationServiceV2;
};

export const certificateService = () => {
  return SunbirdSdk.instance.certificateService;
};

export function sdkDriverFactory(): any {
  return [{
    provide: 'SDK_CONFIG',
    useFactory: authService
  }, {
    provide: 'AUTH_SERVICE',
    useFactory: authService
  }, {
    provide: 'DB_SERVICE',
    useFactory: dbService
  }, {
    provide: 'COURSE_SERVICE',
    useFactory: courseService
  }, {
    provide: 'SHARED_PREFERENCES',
    useFactory: sharedPreferences
  }, {
    provide: 'API_SERVICE',
    useFactory: apiService
  }, {
    provide: 'PAGE_ASSEMBLE_SERVICE',
    useFactory: pageAssembleService
  }, {
    provide: 'GROUP_SERVICE',
    useFactory: groupService
  }, {
    provide: 'PROFILE_SERVICE',
    useFactory: profileService
  }, {
    provide: 'DEVICE_REGISTER_SERVICE',
    useFactory: deviceRegisterService
  }, {
    provide: 'DB_SERVICE',
    useFactory: dbService
  }, {
    provide: 'FRAMEWORK_SERVICE',
    useFactory: frameworkService
  }, {
    provide: 'FRAMEWORK_UTIL_SERVICE',
    useFactory: frameworkUtilService
  }, {
    provide: 'PAGE_ASSEMBLE_SERVICE',
    useFactory: pageAssembleService
  }, {
    provide: 'FORM_SERVICE',
    useFactory: formService
  }, {
    provide: 'SYSTEM_SETTINGS_SERVICE',
    useFactory: systemSettingsService
  }, {
    provide: 'TELEMETRY_SERVICE',
    useFactory: telemetryService
  }, {
    provide: 'CONTENT_SERVICE',
    useFactory: contentService
  }, {
    provide: 'CONTENT_FEEDBACK_SERVICE',
    useFactory: contentFeedbackService
  }, {
    provide: 'EVENTS_BUS_SERVICE',
    useFactory: eventsBusService
  }, {
    provide: 'DEVICE_INFO',
    useFactory: deviceInfo
  }, {
    provide: 'PLAYER_SERVICE',
    useFactory: playerService
  }, {
    provide: 'DOWNLOAD_SERVICE',
    useFactory: downloadService
  }, {
    provide: 'STORAGE_SERVICE',
    useFactory: storageService
  }, {
    provide: 'NOTIFICATION_SERVICE',
    useFactory: notificationService
  }, {
    provide: 'ERROR_LOGGER_SERVICE',
    useFactory: errorLoggerService
  }, {
    provide: 'SEARCH_HISTORY_SERVICE',
    useFactory: searchHistoryService
  }, {
    provide: 'CODEPUSH_EXPERIMENT_SERVICE',
    useFactory: codePushExperimentService
  }, {
    provide: 'NETWORK_INFO_SERVICE',
    useFactory: networkInfoService
  }, {
    provide: 'FAQ_SERVICE',
    useFactory: faqService
  }, {
    provide: 'ARCHIVE_SERVICE',
    useFactory: archiveService
  }, {
    provide: 'DISCUSSION_SERVICE',
    useFactory: discussionService
  }, {
    provide: 'SEGMENTATION_SERVICE',
    useFactory: segmentationService
  }, {
    provide: 'DEBUGGING_SERVICE',
    useFactory: debuggingService
  }, {
    provide: 'NOTIFICATION_SERVICE_V2',
    useFactory: notificationServiceV2
  }, {
    provide: 'CERTIFICATE_SERVICE',
    useFactory: certificateService
  }];
}

export const sunbirdSdkServicesProvidersFactory: () => Provider[] = sdkDriverFactory;

export const sunbirdSdkFactory =
  () => {
    return async () => {
      // const buildConfigValues = JSON.parse(await new Promise<string>((resolve, reject) => {
      //   document.addEventListener('deviceready', () => {
      //     sbutility.getBuildConfigValues('org.sunbird.app', (v) => {
      //       resolve(v);
      //     }, (err) => {
      //       // reject(err);
      //     });
      //   }, false);

      // }));

      const buildConfigValues = buildConfig
      console.log("copnfig ******** ", buildConfigValues);

      await SunbirdSdk.instance.init({
        platform: 'cordova',
        fileConfig: {
        },
        apiConfig: {
          debugMode: configuration.debug,
          host: buildConfigValues['BASE_URL'],
          user_authentication: {
            redirectUrl: buildConfigValues['OAUTH_REDIRECT_URL'],
            authUrl: '/auth/realms/sunbird/protocol/openid-connect',
            mergeUserHost: buildConfigValues['MERGE_ACCOUNT_BASE_URL'],
            autoMergeApiPath: '/migrate/user/account'
          },
          api_authentication: {
            mobileAppKey: buildConfigValues['MOBILE_APP_KEY'],
            mobileAppSecret: buildConfigValues['MOBILE_APP_SECRET'],
            mobileAppConsumer: buildConfigValues['MOBILE_APP_CONSUMER'],
            channelId: buildConfigValues['CHANNEL_ID'],
            producerId: buildConfigValues['PRODUCER_ID'],
            producerUniqueId: 'sunbird.app'
          },
          cached_requests: {
            timeToLive: 2 * 60 * 60 * 1000
          }
        },
        eventsBusConfig: {
          debugMode: true
        },
        dbConfig: {
          dbName: 'GenieServices.db'
        },
        deviceRegisterConfig: {
          apiPath: '/api/v3/device'
        },
        contentServiceConfig: {
          apiPath: '/api/content/v2',
          searchApiPath: '/api/content/v1',
          contentHeirarchyAPIPath: '/api/collection/v1',
          questionSetReadApiPath: '/api/questionset/v2',
          questionReadApiPath: '/api/question/v2/'
        },
        courseServiceConfig: {
          apiPath: '/api/course/v1'
        },
        formServiceConfig: {
          apiPath: '/api/data/v1/form',
          formConfigDirPath: '/data/form',
        },
        frameworkServiceConfig: {
          channelApiPath: '/api/channel/v1',
          frameworkApiPath: '/api/framework/v1',
          frameworkConfigDirPath: '/data/framework',
          channelConfigDirPath: '/data/channel',
          searchOrganizationApiPath: '/api/org/v2',
          systemSettingsDefaultChannelIdKey: 'custodianOrgId',
          overriddenDefaultChannelId: onboarding.overriddenDefaultChannelId
        },
        profileServiceConfig: {
          profileApiPath: '/api/user/v1',
          profileApiPath_V2: '/api/user/v2',
          profileApiPath_V5: '/api/user/v5',
          tenantApiPath: '/v1/tenant',
          otpApiPath: '/api/otp/v2',
          searchLocationApiPath: '/api/data/v1',
          locationDirPath: '/data/location'
        },
        pageServiceConfig: {
          apiPath: '/api/data/v1',
        },
        appConfig: {
          maxCompatibilityLevel: 5,
          minCompatibilityLevel: 1
        },
        systemSettingsConfig: {
          systemSettingsApiPath: '/api/data/v1',
          systemSettingsDirPath: '/data/system',
        },
        telemetryConfig: {
          apiPath: '/api/data/v1',
          telemetrySyncBandwidth: 200,
          telemetrySyncThreshold: 200,
          telemetryLogMinAllowedOffset: 86400000
        },
        sharedPreferencesConfig: {
        },
        certificateServiceConfig: {
          apiPath: '/api/certreg/v2',
          apiPathLegacy: '/api/certreg/v1',
          rcApiPath: '/api/rc/${schemaName}/v1',
        },
        playerConfig: {
          showEndPage: false,
          endPage: [{
            template: 'assessment',
            contentType: [CsContentType.SELF_ASSESS]
          }],
          splash: {
            webLink: '',
            text: '',
            icon: '',
            bgImage: 'assets/icons/splacebackground_1.png'
          },
          overlay: {
            enableUserSwitcher: false,
            showUser: false
          },
          plugins: [
            {
              id: 'org.sunbird.player.endpage',
              ver: '1.1',
              type: 'plugin'
            }
          ]
        },
        errorLoggerConfig: {
          errorLoggerApiPath: '/api/data/v1/client/logs'
        },
        faqServiceConfig: {
          faqConfigDirPath: '/data/faq'
        }
      });

      window['sunbird'] = SunbirdSdk.instance;
    };
  };


declare const sbutility;
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (translateHttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    SuiRatingModule,
    IonicModule.forRoot({
      scrollPadding: false,
      scrollAssist: true,
      // autoFocusAssist: false
    }),
    DirectivesModule,
    // custom modules=
    UserTypeSelectionPageModule,
    PageFilterPageModule,
    PageFilterOptionsPageModule,
    TermsAndConditionsPageModule,
    // IonicStorageModule.forRoot(),
    // CoreModule,
    SbSearchFilterModule.forRoot('mobile'),
  ],
  providers: [
    File,
    FileTransferObject,
    FileTransfer,
    AppGlobalService,
    CourseUtilService,
    TelemetryGeneratorService,
    QRScannerResultHandler,
    SunbirdQRScanner,
    CommonUtilService,
    LogoutHandlerService,
    LoginHandlerService,
    TncUpdateHandlerService,
    ContainerService,
    UtilityService,
    LocalCourseService,
    AppHeaderService,
    AppRatingService,
    FormAndFrameworkUtilService,
    DownloadPdfService,
    PrintPdfService,
    CollectionService,
    AndroidPermissionsService,
    ComingSoonMessageService,
    ActivePageService,
    CanvasPlayerService,
    SplashcreenTelemetryActionHandlerDelegate,
    SplashscreenImportActionHandlerDelegate,
    SplaschreenDeeplinkActionHandlerDelegate,
    SplashScreenService,
    ExternalIdVerificationService,
    TextbookTocService,
    GroupHandlerService,
    // NativePageTransitions,
    NavigationService,
    ContentAggregatorHandler,
    AliasBoardName,
    ConsentService,
    ProfileHandler,
    LocationHandler,
    DiscussionTelemetryService,
    UpdateProfileService,
    SegmentationTagService,
    LoginNavigationHandlerService,
    GooglePlus,
    StoragePermissionHandlerService,
    OnboardingConfigurationService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ...sunbirdSdkServicesProvidersFactory(),
    { provide: ErrorHandler, useClass: CrashAnalyticsErrorLogger },
    { provide: APP_INITIALIZER, useFactory: sunbirdSdkFactory, deps: [], multi: true },
    // Camera,
    // FilePath,
    // Chooser,
    // PhotoViewer,
    // StreamingMedia,
    QumlPlayerService,
    { provide: 'SB_NOTIFICATION_SERVICE', useClass: NotificationService },
    TranslateJsonPipe
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {
  constructor(
    private platform: Platform,
    private translate: TranslateService
  ) {
    this.intialiseApp();
    this.setDefaultLanguage();
  }
  async intialiseApp() {
    await this.platform.ready().then((src) => {
      console.log("******* platform ready ", src);
      SplashScreen.hide();
    }).catch(err => {
      console.log("error on platform ready ");
    })
  }

  private setDefaultLanguage() {
    this.translate.setDefaultLang('en');
  }
}
