import { CourseBatchesPage } from './course-batches.page';
import {
    AppGlobalService, LoginHandlerService,
    CommonUtilService, TelemetryGeneratorService,
    AppHeaderService, LocalCourseService,
    InteractType, InteractSubtype,
    Environment, PageId, ImpressionType
} from '../../services';
import { PopoverController, Events, Platform } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {
    SharedPreferences,
    Batch,
    EnrollCourseRequest
} from 'sunbird-sdk';
import { PreferenceKey, EventTopics } from '../app.constant';
import { of, throwError } from 'rxjs';

describe('CourseBatchesPage', () => {
    let courseBatchesPage: CourseBatchesPage;
    const mockSharedPreferences: SharedPreferences = {};
    const mockAppGlobalService: Partial<AppGlobalService> = {};
    const mockPopoverCtrl: Partial<PopoverController> = {};
    const mockLoginHandlerService: Partial<LoginHandlerService> = {};
    const mockZone: Partial<NgZone> = {};
    const mockCommonUtilService: Partial<CommonUtilService> = {};
    const mockEvents: Partial<Events> = {};
    const mockTelemetryGeneratorService: Partial<TelemetryGeneratorService> = {};
    const mockHeaderService: Partial<AppHeaderService> = {};
    const mockLocation: Partial<Location> = {};
    const mockRouter: Partial<Router> = {
        getCurrentNavigation: jest.fn(() => ({
            extras: {
                state: {
                    ongoingBatches: [],
                    upcommingBatches: [],
                    course: {},
                    objRollup: {},
                    corRelationList: [],
                    telemetryObject: {
                        id: '',
                        type: '',
                        version: ''
                    }
                }
            }
        })) as any
    };
    const mockPlatform: Partial<Platform> = {};
    const mockLocalCourseService: Partial<LocalCourseService> = {};

    beforeAll(() => {
        courseBatchesPage = new CourseBatchesPage(
            mockSharedPreferences as SharedPreferences,
            mockAppGlobalService as AppGlobalService,
            mockPopoverCtrl as PopoverController,
            mockLoginHandlerService as LoginHandlerService,
            mockZone as NgZone,
            mockCommonUtilService as CommonUtilService,
            mockEvents as Events,
            mockTelemetryGeneratorService as TelemetryGeneratorService,
            mockHeaderService as AppHeaderService,
            mockLocation as Location,
            mockRouter as Router,
            mockPlatform as Platform,
            mockLocalCourseService as LocalCourseService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('Should instanciate CourseBatchesPage', () => {
        expect(courseBatchesPage).toBeTruthy();
    });

    it('Should not unsubscribe if backButtonFunc is undefined', () => {
        // arrange
        // act
        courseBatchesPage.ionViewWillLeave();
        // assert
    });

    it('Should update page config', (done) => {
        // arrange
        mockHeaderService.getDefaultPageConfig = jest.fn(() => ({
            showHeader: true,
            showBurgerMenu: true,
            pageTitle: 'string',
            actionButtons: ['true'],
        }));
        mockHeaderService.updatePageConfig = jest.fn();
        mockPlatform.backButton = {
            subscribeWithPriority: jest.fn((_, cb) => {
                setTimeout(() => {
                    cb();
                }, 0);
                return {
                    unsubscribe: jest.fn()
                };
            }),
        } as any;
        mockLocation.back = jest.fn();

        // act
        courseBatchesPage.ionViewWillEnter();
        // assert
        setTimeout(() => {
            expect(mockHeaderService.getDefaultPageConfig).toHaveBeenCalled();
            expect(mockHeaderService.updatePageConfig).toHaveBeenCalled();
            expect(mockPlatform.backButton).not.toBeUndefined();
            expect(mockLocation.back).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('Should unsubscribe if backButtonFunc is not undefined', (done) => {
        // arrange
        mockPlatform.backButton = {
            subscribeWithPriority: jest.fn((_, cb) => {
                setTimeout(() => {
                    cb();
                }, 0);
                return {
                    unsubscribe: jest.fn()
                };
            }),
        } as any;
        // act
        courseBatchesPage.ionViewWillLeave();
        // assert
        setTimeout(() => {
            // expect(mockPlatform.backButton.unsubscribe).toHaveBeenCalled();
            done();
        }, 0);
    });

    describe('enrollIntoBatch', () => {
        it('Should set user id and isGuestUser and call getBatchesByCourseId if loggedin user', (done) => {
            // arrange
            mockAppGlobalService.getActiveProfileUid = jest.fn(() => Promise.resolve('sample-uid'));
            mockAppGlobalService.isUserLoggedIn = jest.fn(() => true);
            // act
            courseBatchesPage.ngOnInit();
            // assert
            setTimeout(() => {
                expect(mockAppGlobalService.isUserLoggedIn).toHaveBeenCalled();
                expect(mockAppGlobalService.getActiveProfileUid).toHaveBeenCalled();
                done();
            }, 0);
        });

        it('Should enroll into batch if logged user', (done) => {
            // arrange
            const batch: Batch = {
                id: 'some_batch_id',
                courseId: 'some_course_id',
                status: 0
            };
            const enrollCourseRequest: EnrollCourseRequest = {
                batchId: batch.id,
                courseId: batch.courseId,
                userId: 'sample-uid',
                batchStatus: batch.status
            };
            mockLocalCourseService.prepareEnrollCourseRequest = jest.fn(() => (enrollCourseRequest));

            const reqvalues = new Map();
            reqvalues.set('enrollReq', enrollCourseRequest);
            mockLocalCourseService.prepareRequestValue = jest.fn(() => (reqvalues));
            mockTelemetryGeneratorService.generateInteractTelemetry = jest.fn();
            const dismissFn = jest.fn(() => Promise.resolve());
            const presentFn = jest.fn(() => Promise.resolve());
            mockCommonUtilService.getLoader = jest.fn(() => ({
                present: presentFn,
                dismiss: dismissFn,
            }));
            mockLocalCourseService.enrollIntoBatch = jest.fn(() => of({}));
            mockZone.run = jest.fn((fn) => fn());
            mockCommonUtilService.translateMessage = jest.fn((key, fields) => {
                switch (key) {
                    case 'COURSE_ENROLLED':
                        return 'COURSE_ENROLLED';
                }
            });
            mockCommonUtilService.showToast = jest.fn();
            mockEvents.publish = jest.fn(() => []);

            // act
            courseBatchesPage.enrollIntoBatch(batch);
            // assert
            setTimeout(() => {
                expect(mockLocalCourseService.prepareEnrollCourseRequest).toHaveBeenCalledWith('sample-uid', batch);
                expect(mockLocalCourseService.prepareRequestValue).toHaveBeenCalledWith(enrollCourseRequest);
                expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(
                    InteractType.TOUCH,
                    InteractSubtype.ENROLL_CLICKED,
                    Environment.HOME,
                    PageId.COURSE_BATCHES,
                    {
                        id: '',
                        type: '',
                        version: '',
                    },
                    reqvalues,
                    {},
                    []);
                expect(presentFn).toHaveBeenCalled();
                expect(dismissFn).toHaveBeenCalled();
                expect(mockLocalCourseService.enrollIntoBatch).toHaveBeenCalledWith({
                    userId: 'sample-uid',
                    batch,
                    pageId: PageId.COURSE_BATCHES,
                    courseId: undefined,
                    telemetryObject: {
                        id: '',
                        type: '',
                        version: '',
                    },
                    objRollup: {},
                    corRelationList: []
                });
                expect(mockZone.run).toHaveBeenCalled();
                expect(mockCommonUtilService.translateMessage).toHaveBeenCalledWith('COURSE_ENROLLED');
                expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('COURSE_ENROLLED');
                expect(mockEvents.publish).toHaveBeenCalledWith(EventTopics.ENROL_COURSE_SUCCESS, {
                    batchId: batch.id,
                    courseId: batch.courseId
                });
                done();
            }, 0);
        });

        it('Should enroll into batch if logged user go to catch block if throws error', (done) => {
            // arrange
            const batch: Batch = {
                id: 'some_batch_id',
                courseId: 'some_course_id',
                status: 0
            };
            const enrollCourseRequest: EnrollCourseRequest = {
                batchId: batch.id,
                courseId: batch.courseId,
                userId: 'sample-uid',
                batchStatus: batch.status
            };
            mockLocalCourseService.prepareEnrollCourseRequest = jest.fn(() => (enrollCourseRequest));

            const reqvalues = new Map();
            reqvalues.set('enrollReq', enrollCourseRequest);
            mockLocalCourseService.prepareRequestValue = jest.fn(() => (reqvalues));
            mockTelemetryGeneratorService.generateInteractTelemetry = jest.fn();
            const dismissFn = jest.fn(() => Promise.resolve());
            const presentFn = jest.fn(() => Promise.resolve());
            mockCommonUtilService.getLoader = jest.fn(() => ({
                present: presentFn,
                dismiss: dismissFn,
            }));
            mockLocalCourseService.enrollIntoBatch = jest.fn(() => throwError({ error: 'error' }));

            // act
            courseBatchesPage.enrollIntoBatch(batch);
            // assert
            setTimeout(() => {
                expect(mockLocalCourseService.prepareEnrollCourseRequest).toHaveBeenCalledWith('sample-uid', batch);
                expect(mockLocalCourseService.prepareRequestValue).toHaveBeenCalledWith(enrollCourseRequest);
                expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(
                    InteractType.TOUCH,
                    InteractSubtype.ENROLL_CLICKED,
                    Environment.HOME,
                    PageId.COURSE_BATCHES,
                    {
                        id: '',
                        type: '',
                        version: '',
                    },
                    reqvalues,
                    {},
                    []);
                expect(presentFn).toHaveBeenCalled();
                expect(dismissFn).toHaveBeenCalled();
                expect(mockLocalCourseService.enrollIntoBatch).toHaveBeenCalledWith({
                    userId: 'sample-uid',
                    batch,
                    pageId: PageId.COURSE_BATCHES,
                    courseId: undefined,
                    telemetryObject: {
                        id: '',
                        type: '',
                        version: '',
                    },
                    objRollup: {},
                    corRelationList: []
                });
                done();
            }, 0);
        });

        it('Should set user id and isGuestUser and call getBatchesByCourseId if guest user', (done) => {
            // arrange
            mockAppGlobalService.getActiveProfileUid = jest.fn(() => Promise.resolve('sample-uid'));
            mockAppGlobalService.isUserLoggedIn = jest.fn(() => false);
            // act
            courseBatchesPage.ngOnInit();
            // assert
            setTimeout(() => {
                expect(mockAppGlobalService.isUserLoggedIn).toHaveBeenCalled();
                expect(mockAppGlobalService.getActiveProfileUid).toHaveBeenCalled();
                done();
            }, 0);
        });

        it('Should show signin poup if guest user', (done) => {
            // arrange
            const batch: Batch = {
                id: 'some_batch_id',
                courseId: 'some_course_id',
                status: 0
            };
            const enrollCourseRequest: EnrollCourseRequest = {
                batchId: batch.id,
                courseId: batch.courseId,
                userId: 'sample-uid',
                batchStatus: batch.status
            };
            mockLocalCourseService.prepareEnrollCourseRequest = jest.fn(() => (enrollCourseRequest));

            const reqvalues = new Map();
            reqvalues.set('enrollReq', enrollCourseRequest);
            mockLocalCourseService.prepareRequestValue = jest.fn(() => (reqvalues));
            mockTelemetryGeneratorService.generateInteractTelemetry = jest.fn();
            mockTelemetryGeneratorService.generateImpressionTelemetry = jest.fn();
            mockCommonUtilService.translateMessage = jest.fn((key, fields) => {
                switch (key) {
                    case 'YOU_MUST_JOIN_TO_ACCESS_TRAINING_DETAIL':
                        return 'YOU_MUST_JOIN_TO_ACCESS_TRAINING_DETAIL';
                    case 'TRAININGS_ONLY_REGISTERED_USERS':
                        return 'TRAININGS_ONLY_REGISTERED_USERS';
                    case 'OVERLAY_SIGN_IN':
                        return 'OVERLAY_SIGN_IN';
                }
            });
            mockPopoverCtrl.create = jest.fn(() => (Promise.resolve({
                present: jest.fn(() => Promise.resolve({})),
                onDidDismiss: jest.fn(() => Promise.resolve({ data: { canDelete: true } }))
            } as any)));
            mockSharedPreferences.putString = jest.fn(() => of(undefined));
            mockLoginHandlerService.signIn = jest.fn();

            // act
            courseBatchesPage.enrollIntoBatch(batch);
            // assert
            setTimeout(() => {
                expect(mockLocalCourseService.prepareEnrollCourseRequest).toHaveBeenCalledWith('sample-uid', batch);
                expect(mockLocalCourseService.prepareRequestValue).toHaveBeenCalledWith(enrollCourseRequest);
                expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(
                    InteractType.TOUCH,
                    InteractSubtype.ENROLL_CLICKED,
                    Environment.HOME,
                    PageId.COURSE_BATCHES,
                    {
                        id: '',
                        type: '',
                        version: '',
                    },
                    reqvalues,
                    {},
                    []);
                expect(mockTelemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalledWith(
                    ImpressionType.VIEW,
                    '',
                    PageId.SIGNIN_POPUP,
                    Environment.HOME,
                    '',
                    '',
                    '',
                    {},
                    []);
                expect(mockCommonUtilService.translateMessage).toHaveBeenNthCalledWith(1, 'YOU_MUST_JOIN_TO_ACCESS_TRAINING_DETAIL');
                expect(mockCommonUtilService.translateMessage).toHaveBeenNthCalledWith(2, 'TRAININGS_ONLY_REGISTERED_USERS');
                expect(mockCommonUtilService.translateMessage).toHaveBeenNthCalledWith(3, 'OVERLAY_SIGN_IN');
                expect(mockCommonUtilService.translateMessage).toHaveBeenNthCalledWith(4, 'OVERLAY_SIGN_IN');
                expect(mockPopoverCtrl.create).toHaveBeenCalledWith(expect.objectContaining({
                    componentProps: expect.objectContaining({
                        sbPopoverHeading: 'OVERLAY_SIGN_IN',
                        sbPopoverMainTitle: 'YOU_MUST_JOIN_TO_ACCESS_TRAINING_DETAIL',
                        metaInfo: 'TRAININGS_ONLY_REGISTERED_USERS',
                        actionsButtons: expect.arrayContaining([
                            expect.objectContaining({
                                btntext: 'OVERLAY_SIGN_IN'
                            })
                        ])
                    })
                }));
                expect(mockSharedPreferences.putString).toHaveBeenNthCalledWith(1, PreferenceKey.BATCH_DETAIL_KEY, JSON.stringify(batch));
                expect(mockSharedPreferences.putString).toHaveBeenNthCalledWith(2, PreferenceKey.COURSE_DATA_KEY, JSON.stringify({}));
                expect(mockSharedPreferences.putString).toHaveBeenNthCalledWith(3, PreferenceKey.CDATA_KEY, JSON.stringify([]));
                expect(mockLoginHandlerService.signIn).toHaveBeenCalled();
                done();
            }, 0);
        });

        it('Should show signin poup if guest user and clicked dismiss', (done) => {
            // arrange
            mockAppGlobalService.isUserLoggedIn = jest.fn(() => false);
            const batch: Batch = {
                id: 'some_batch_id',
                courseId: 'some_course_id',
                status: 0
            };
            const enrollCourseRequest: EnrollCourseRequest = {
                batchId: batch.id,
                courseId: batch.courseId,
                userId: 'sample-uid',
                batchStatus: batch.status
            };
            mockLocalCourseService.prepareEnrollCourseRequest = jest.fn(() => (enrollCourseRequest));

            const reqvalues = new Map();
            reqvalues.set('enrollReq', enrollCourseRequest);
            mockLocalCourseService.prepareRequestValue = jest.fn(() => (reqvalues));
            mockTelemetryGeneratorService.generateInteractTelemetry = jest.fn();
            mockTelemetryGeneratorService.generateImpressionTelemetry = jest.fn();
            mockCommonUtilService.translateMessage = jest.fn((key, fields) => {
                switch (key) {
                    case 'YOU_MUST_JOIN_TO_ACCESS_TRAINING_DETAIL':
                        return 'YOU_MUST_JOIN_TO_ACCESS_TRAINING_DETAIL';
                    case 'TRAININGS_ONLY_REGISTERED_USERS':
                        return 'TRAININGS_ONLY_REGISTERED_USERS';
                    case 'OVERLAY_SIGN_IN':
                        return 'OVERLAY_SIGN_IN';
                }
            });
            mockPopoverCtrl.create = jest.fn(() => (Promise.resolve({
                present: jest.fn(() => Promise.resolve({})),
                onDidDismiss: jest.fn(() => Promise.resolve({}))
            } as any)));

            // act
            courseBatchesPage.enrollIntoBatch(batch);
            // assert
            setTimeout(() => {
                expect(mockLocalCourseService.prepareEnrollCourseRequest).toHaveBeenCalledWith('sample-uid', batch);
                expect(mockLocalCourseService.prepareRequestValue).toHaveBeenCalledWith(enrollCourseRequest);
                expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(
                    InteractType.TOUCH,
                    InteractSubtype.ENROLL_CLICKED,
                    Environment.HOME,
                    PageId.COURSE_BATCHES,
                    {
                        id: '',
                        type: '',
                        version: '',
                    },
                    reqvalues,
                    {},
                    []);
                expect(mockTelemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalledWith(
                    ImpressionType.VIEW,
                    '',
                    PageId.SIGNIN_POPUP,
                    Environment.HOME,
                    '',
                    '',
                    '',
                    {},
                    []);
                expect(mockPopoverCtrl.create).toHaveBeenCalledWith(expect.objectContaining({
                    componentProps: expect.objectContaining({
                        sbPopoverHeading: 'OVERLAY_SIGN_IN',
                        sbPopoverMainTitle: 'YOU_MUST_JOIN_TO_ACCESS_TRAINING_DETAIL',
                        metaInfo: 'TRAININGS_ONLY_REGISTERED_USERS',
                        actionsButtons: expect.arrayContaining([
                            expect.objectContaining({
                                btntext: 'OVERLAY_SIGN_IN'
                            })
                        ])
                    })
                }));
                done();
            }, 0);
        });
    });

    it('goBack', () => {
        // arrange
        mockLocation.back = jest.fn();
        // act
        courseBatchesPage.goBack();
        // assert
        expect(mockLocation.back).toHaveBeenCalled();
    });
});