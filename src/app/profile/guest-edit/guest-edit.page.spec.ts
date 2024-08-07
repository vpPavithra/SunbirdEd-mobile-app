import { GuestEditPage } from './guest-edit.page';
import {
    FrameworkService,
    FrameworkUtilService,
    ProfileService,
    Framework,
    FrameworkCategoryCodesGroup,
    GetSuggestedFrameworksRequest,
    SharedPreferences,
    CorrelationData
} from '@project-sunbird/sunbird-sdk';
import { TranslateService } from '@ngx-translate/core';
import { Events } from '../../../util/events';
import { Router, ActivatedRoute } from '@angular/router';
import {
    AppGlobalService,
    TelemetryGeneratorService,
    CommonUtilService,
    ContainerService,
    AppHeaderService,
    InteractType,
    InteractSubtype,
    Environment,
    PageId,
    ImpressionType,
    ObjectType,
    LoginHandlerService,
    OnboardingConfigurationService,
    FormAndFrameworkUtilService
} from '../../../services';
import { Location } from '@angular/common';
import { of, Subscription, throwError } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfileHandler } from '../../../services/profile-handler';
import { SegmentationTagService } from '../../../services/segmentation-tag/segmentation-tag.service';
import { mockOnboardingConfigData } from '../../components/discover/discover.page.spec.data';
import { ProfileType } from '@project-sunbird/sunbird-sdk';
import { PreferenceKey } from '../../app.constant';

describe('GuestEditPage', () => {
    let guestEditPage: GuestEditPage;
    const mockAppGlobalService: Partial<AppGlobalService> = {
        generateSaveClickedTelemetry: jest.fn(),
        getRequiredCategories: jest.fn()
    };
    const presentFn = jest.fn(() => Promise.resolve());
    const dismissFn = jest.fn(() => Promise.resolve());
    const mockCommonUtilService: Partial<CommonUtilService> = {
        translateMessage: jest.fn(() => 'select-box'),
        showToast: jest.fn(),
        getLoader: jest.fn(() => Promise.resolve({
            present: presentFn,
            dismiss: dismissFn
        })),
    };
    const mockContainer: Partial<ContainerService> = {};
    const mockEvents: Partial<Events> = {};
    const mockFrameworkService: Partial<FrameworkService> = {};
    const mockFrameworkUtilService: Partial<FrameworkUtilService> = {};
    const mockHeaderService: Partial<AppHeaderService> = {};
    const mockLocation: Partial<Location> = {};
    const mockProfileService: Partial<ProfileService> = {};
    const mockRoterExtras = {
        extras: {
            state: {
                contentType: 'contentType',
                corRelationList: 'corRelationList',
                source: 'source',
                enrolledCourses: 'enrolledCourses' as any,
                userId: 'userId',
                shouldGenerateEndTelemetry: false,
                isNewUser: true,
                lastCreatedProfile: { id: 'sample-id' },
                profile: {identifier: 'sample-id',  syllabus: [''], categories: JSON.stringify([{code: 'board', identifier: 'sample-id'}, {code: 'medium', identifier: 'sample-id1'}])}
            }
        }
    };
    const mockRouter: Partial<Router> = {
        getCurrentNavigation: jest.fn(() => mockRoterExtras as any),
        navigate: jest.fn(() => Promise.resolve(true))
    };
    const mockTelemetryGeneratorService: Partial<TelemetryGeneratorService> = {
        generateInteractTelemetry: jest.fn(),
        generateImpressionTelemetry: jest.fn()
    };
    const mockTranslate: Partial<TranslateService> = {};
    const mockActivatedRoute: Partial<ActivatedRoute> = {};
    mockActivatedRoute.snapshot = {
        queryParams: {
            reOnBoard: {}
        }
    } as any;
    const mockSharedPreferences: Partial<SharedPreferences> = {
        putString: jest.fn(),
        getString: jest.fn(() => of('ka' as any))
    };
    const mockFb: Partial<FormBuilder> = {
        group: jest.fn(() => ({})) as any,
        control: jest.fn()
    };

    const mockProfileHandler: Partial<ProfileHandler> = {
        getSupportedProfileAttributes: jest.fn(() => Promise.resolve({ borad: 'board', medium: 'medium', gradeLevel: 'gradeLevel' }))
    };
    const mockLoginHandlerService: Partial<LoginHandlerService> = {};
    const mockSegmentationTagService: Partial<SegmentationTagService> = {
        evalCriteria: jest.fn()
    };

    const mockOnBoardingConfigService: Partial<OnboardingConfigurationService> = {
        getAppConfig: jest.fn(() => mockOnboardingConfigData)
    };

    const mockFormAndFrameworkUtilService: Partial<FormAndFrameworkUtilService> = {
        invokedGetFrameworkCategoryList: jest.fn(() => Promise.resolve([{index: 3, itemList: []}]))
    };

    beforeAll(() => {
        guestEditPage = new GuestEditPage(
            mockProfileService as ProfileService,
            mockFrameworkService as FrameworkService,
            mockFrameworkUtilService as FrameworkUtilService,
            mockSharedPreferences as SharedPreferences,
            mockAppGlobalService as AppGlobalService,
            mockCommonUtilService as CommonUtilService,
            mockFb as FormBuilder,
            mockTranslate as TranslateService,
            mockEvents as Events,
            mockTelemetryGeneratorService as TelemetryGeneratorService,
            mockHeaderService as AppHeaderService,
            mockRouter as Router,
            mockLocation as Location,
            mockProfileHandler as ProfileHandler,
            mockSegmentationTagService as SegmentationTagService,
            mockOnBoardingConfigService as OnboardingConfigurationService,
            mockFormAndFrameworkUtilService as FormAndFrameworkUtilService
        );
        mockRouter.getCurrentNavigation = jest.fn(() => ({extras: { state: {isNewUser: false, isCurretUser: false, profile: {syllabus: [''], identifier: 'sample-id', categories: JSON.stringify([{code: 'board', identifier: 'sample-id'}, {code: 'medium', identifier: 'sample-id1'}])}}}})) as any;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should be create a instance of guestEditPage', () => {
        expect(guestEditPage).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should generate INTERACT and IMPRESSION telemetry for existing User', (done) => {
            // arrange
            mockFormAndFrameworkUtilService.invokedGetFrameworkCategoryList = jest.fn(() => Promise.resolve({
                supportedFrameworkConfig: [
                    {
                      "code": "category1",
                      "label": "{\"en\":\"Board\"}",
                      "placeHolder": "{\"en\":\"Selected Board\"}",
                      "frameworkCode": "board",
                      "supportedUserTypes": [
                          "teacher",
                          "student",
                          "administrator",
                          "parent",
                          "other"
                      ]
                  },
                  {
                      "code": "category2",
                      "label": "{\"en\":\"Medium\"}",
                      "placeHolder": "{\"en\":\"Selected Medium\"}",
                      "frameworkCode": "medium",
                      "supportedUserTypes": [
                          "teacher",
                          "student",
                          "parent",
                          "other"
                      ]
                  }
                  ],
                  supportedAttributes: {board: 'board'},
                  userType: 'teacher'
            }));
            const dismissFn = jest.fn(() => Promise.resolve());
            const presentFn = jest.fn(() => Promise.resolve());
            mockCommonUtilService.getLoader = jest.fn(() => Promise.resolve({
                present: presentFn,
                dismiss: dismissFn,
            })) as any;
            mockOnBoardingConfigService.getAppConfig = jest.fn(() => mockOnboardingConfigData);
            guestEditPage['isNewUser'] = false;
            mockProfileHandler.getSupportedUserTypes = jest.fn(() => Promise.resolve(
                [{ code: 'teacher' }]));
            guestEditPage.guestEditForm = {
                valueChanges: of({
                    board: ['sample-board']
                }),
                get: jest.fn(() => (
                    {
                        valueChanges: of(['SAMPLE_STRING']),
                        patchValue: jest.fn()
                    }
                ))
            } as any;
            mockFrameworkUtilService.getFrameworkCategoryTerms = jest.fn(() => of([{name: 'SAMPLE_STRING', code: 'SAMPLE_STRING'}]));
            mockFrameworkService.getFrameworkDetails = jest.fn(() => of({
                identifier: 'do_123',
                name: 'sample-name'
            }));
            // act
            guestEditPage.ngOnInit();
            setTimeout(() => {
                expect(mockFormAndFrameworkUtilService.invokedGetFrameworkCategoryList).toHaveBeenCalled();
                expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(
                    InteractType.TOUCH,
                    InteractSubtype.EDIT_USER_INITIATED,
                    Environment.USER,
                    PageId.CREATE_USER
                );
                expect(mockTelemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalledWith(
                    ImpressionType.VIEW,
                    '',
                    PageId.CREATE_USER,
                    Environment.USER, undefined,
                    ObjectType.USER
                );
                done();
            }, 0);
        });

        it('should populate the supported attributes', (done) => {
            // arrange
            mockFormAndFrameworkUtilService.invokedGetFrameworkCategoryList = jest.fn(() => Promise.resolve({
                supportedFrameworkConfig: [
                    {
                      "code": "category1",
                      "label": "{\"en\":\"Board\"}",
                      "placeHolder": "{\"en\":\"Selected Board\"}",
                      "frameworkCode": "board",
                      "supportedUserTypes": [
                          "teacher",
                          "student",
                          "administrator",
                          "parent",
                          "other"
                      ]
                  },
                  {
                      "code": "category2",
                      "label": "{\"en\":\"Medium\"}",
                      "placeHolder": "{\"en\":\"Selected Medium\"}",
                      "frameworkCode": "medium",
                      "supportedUserTypes": [
                          "teacher",
                          "student",
                          "parent",
                          "other"
                      ]
                  }
                  ],
                  supportedAttributes: {board: 'board', medium: 'medium',
                  gradeLevel: 'gradeLevel'},
                  userType: 'teacher'
            }));
            mockOnBoardingConfigService.getAppConfig = jest.fn(() => mockOnboardingConfigData);
            guestEditPage.guestEditForm = {
                valueChanges: of({
                    board: ['sample-board']
                })
            } as any;
            mockProfileHandler.getSupportedUserTypes = jest.fn(() => Promise.resolve(
                [{ code: 'teacher' }]));

            guestEditPage['onSyllabusChange'] = jest.fn(() => of({} as any));
            guestEditPage['onMediumChange'] = jest.fn(() => of({} as any));
            guestEditPage['onGradeChange'] = jest.fn(() => of({} as any));
            // act
            guestEditPage.ngOnInit();
            setTimeout(() => {
                // assert
                expect(mockFormAndFrameworkUtilService.invokedGetFrameworkCategoryList).toHaveBeenCalled();
                expect(guestEditPage.supportedProfileAttributes).toEqual({});
                done();
            }, 0);
        });

    });

    describe('ionViewWillEnter', () => {
        it('should be invoked ionViewWillEnter method for create user', () => {
            // arrange
            mockCommonUtilService.translateMessage = jest.fn(() => 'sample header');
            mockHeaderService.showHeaderWithBackButton = jest.fn();
            // jest.spyOn(guestEditPage, 'getSyllabusDetails').mockImplementation(() => {
            //     return Promise.resolve();
            // });
            // act
            guestEditPage.ionViewWillEnter();
            // assert
            expect(mockCommonUtilService.translateMessage).toHaveBeenNthCalledWith(1, 'EDIT_PROFILE');
            expect(mockHeaderService.showHeaderWithBackButton).toHaveBeenCalled();
        });
    
        it('should be invoked ionViewWillEnter method for edit user', () => {
            // arrange
            guestEditPage.isNewUser = false;
            mockCommonUtilService.translateMessage = jest.fn(() => 'sample header');
            mockHeaderService.showHeaderWithBackButton = jest.fn();
            // jest.spyOn(guestEditPage, 'getSyllabusDetails').mockImplementation(() => {
            //     return Promise.resolve();
            // });
            // act
            guestEditPage.ionViewWillEnter();
            // assert
            expect(mockCommonUtilService.translateMessage).toHaveBeenNthCalledWith(1, 'EDIT_PROFILE');
            expect(mockHeaderService.showHeaderWithBackButton).toHaveBeenCalled();
        });
    })

    describe('ionViewWillLeave', () => {
        it('should unsubscribe back function', () => {
            // arrange
            guestEditPage['unregisterBackButton'] = {
                unsubscribe: jest.fn(),
            } as any;
            // act
            guestEditPage.ionViewWillLeave();
            // assert
            expect(guestEditPage['unregisterBackButton'].unsubscribe).toHaveBeenCalled();
        });
    })

    it('should subscribe formControl to call ngOnDestroy()', () => {
        // arrange
        // act
        guestEditPage.ngOnDestroy();
        // assert
    });

    describe('onProfileTypeChange', () => {
        it('should unsubscribe the previous subscription and create a new one', (done) => {
            // arrange
            guestEditPage['onSyllabusChange'] = jest.fn(() => of({} as any));
            guestEditPage['onMediumChange'] = jest.fn(() => of({} as any));
            guestEditPage['onGradeChange'] = jest.fn(() => of({} as any));
            mockFormAndFrameworkUtilService.invokedGetFrameworkCategoryList = jest.fn(() => Promise.resolve({
                supportedFrameworkConfig: [
                    {
                      "code": "category1",
                      "label": "{\"en\":\"Board\"}",
                      "placeHolder": "{\"en\":\"Selected Board\"}",
                      "frameworkCode": "board",
                      "supportedUserTypes": [
                          "teacher",
                          "student",
                          "administrator",
                          "parent",
                          "other"
                      ]
                  },
                  {
                      "code": "category2",
                      "label": "{\"en\":\"Medium\"}",
                      "placeHolder": "{\"en\":\"Selected Medium\"}",
                      "frameworkCode": "medium",
                      "supportedUserTypes": [
                          "teacher",
                          "student",
                          "parent",
                          "other"
                      ]
                  }
                  ],
                  supportedAttributes: {board: 'board', medium: 'medium',
                  gradeLevel: 'gradeLevel'},
                  userType: 'teacher'
            }));
            guestEditPage.guestEditForm = {
                get: jest.fn((arg) => {
                    let value;
                    switch (arg) {
                        case 'syllabus':
                            value = { value: ['AP'] };
                            break;
                        case 'board':
                            value = { value: ['AP'] };
                            break;
                        case 'medium':
                            value = { value: ['English'] };
                            break;
                        case 'grade':
                            value = { value: ['Class 1'] };
                            break;
                        case 'profileType':
                            value = { value: '' };
                            break;
                    }
                    return value;
                }),
                value: jest.fn((arg) => {
                    let value;
                    switch (arg) {
                        case 'profileType':
                            value = { value: '' };
                            break;
                    }
                    return value;
                }),
                patchValue: jest.fn(),
                controls: {
                    syllabus: {
                        validator: jest.fn()
                    },
                    board: {
                        validator: jest.fn()
                    },
                    medium: {
                        validator: jest.fn()
                    },
                    grade: {
                        validator: jest.fn()
                    },
                    profileType: {
                        validator: jest.fn()
                    }
                },
            } as any;
            guestEditPage['formControlSubscriptions'] = {
                unsubscribe: jest.fn()
            } as any;
            // act
            guestEditPage.onProfileTypeChange();

            // assert
            expect(guestEditPage['formControlSubscriptions'].unsubscribe).toHaveBeenCalled();
            done();
        });

    });

    describe('getSyllabusDetails', () => {
        it('should fetch all the syllabus list details', (done) => {
            // arrange
            const dismissFn = jest.fn(() => Promise.resolve());
            const presentFn = jest.fn(() => Promise.resolve());
            mockCommonUtilService.getLoader = jest.fn(() => ({
                present: presentFn,
                dismiss: dismissFn,
            })) as any;
            guestEditPage.guestEditForm = {
                syllabus: ['sampl'],
                get: jest.fn(() => ({ name: 'sample-name', board: 'board', patchValue: jest.fn() }))
            } as any;
            guestEditPage.profile = {
                syllabus: [{ name: 'sample-name' }]
            };
            const frameworkRes: Framework[] = [{
                name: 'SAMPLE_STRING',
                identifier: 'SAMPLE_STRING'
            }];
            mockAppGlobalService.getRequiredCategories = jest.fn(() => (FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES))
            const getSuggestedFrameworksRequest: GetSuggestedFrameworksRequest = {
                from: 'server',
                language: mockTranslate.currentLang,
                requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
            };
            mockCommonUtilService.showToast = jest.fn();
            mockFrameworkUtilService.getActiveChannelSuggestedFrameworkList = jest.fn(() => of(frameworkRes));
            // act
            guestEditPage.getSyllabusDetails();
            // assert
            setTimeout(() => {
                expect(mockCommonUtilService.getLoader).toHaveBeenCalled();
                expect(mockFrameworkUtilService.getActiveChannelSuggestedFrameworkList).toHaveBeenCalledWith(getSuggestedFrameworksRequest);
                done();
            }, 0);
        });

        it('should show data not found toast message if syllabus list is empty.', (done) => {
            // arrange
            const dismissFn = jest.fn(() => Promise.resolve());
            const presentFn = jest.fn(() => Promise.resolve());
            mockCommonUtilService.getLoader = jest.fn(() => ({
                present: presentFn,
                dismiss: dismissFn,
            })) as any;
            const frameworkRes: Framework[] = [];
            mockAppGlobalService.getRequiredCategories = jest.fn(() => (FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES))
            const getSuggestedFrameworksRequest: GetSuggestedFrameworksRequest = {
                from: 'server',
                language: undefined,
                requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
            };
            mockCommonUtilService.showToast = jest.fn();
            mockFrameworkUtilService.getActiveChannelSuggestedFrameworkList = jest.fn(() => of(frameworkRes));
            // act
            guestEditPage.getSyllabusDetails();
            // assert
            setTimeout(() => {
                expect(mockCommonUtilService.getLoader).toHaveBeenCalled();
                expect(mockFrameworkUtilService.getActiveChannelSuggestedFrameworkList).toHaveBeenCalledWith(getSuggestedFrameworksRequest);
                expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('NO_DATA_FOUND');
                expect(guestEditPage.loader.dismiss).toHaveBeenCalled();
                done();
            }, 0);
        });

    });

    describe('generateInteractTelemetry', () => {
        it('should generate inetract telemetry', () => {
            // arrange
            let correlationList: Array<CorrelationData> = [];
            correlationList.push({id: 'id2', type: 'type'})
            mockTelemetryGeneratorService.generateInteractTelemetry = jest.fn()
            // act
            guestEditPage.generateInteractTelemetry(['id'], 'type')
        })
    })

    describe('resetFormCategories', () => {
        it('should rerset form categories ', () => {
            // arrage
            // act
            guestEditPage.resetFormCategories(1)
            // assert
        })
    })

    describe('onCategoryChanged', () => {
        it('should return newValue and oldValue for category changed', (done) => {
            const event = {
                detail: {
                    value: ['math']
                }
            };
            guestEditPage.profileForTelemetry = {
                subject: ['english']
            };
            mockAppGlobalService.generateAttributeChangeTelemetry = jest.fn();
            // act
            guestEditPage.onCategoryChanged('subject', event, 1);
            setTimeout(() => {
                done()
            }, 0);
        });

        it('should return newValue and oldValue if category is not changed', (done) => {
            const event = {
                detail: {
                    value: ['math']
                }
            };
            guestEditPage.profileForTelemetry = {
                subject: ['math']
            };
            mockAppGlobalService.generateAttributeChangeTelemetry = jest.fn();
            // act
            guestEditPage.onCategoryChanged('subject', event, 2);
            // assert
            setTimeout(() => {
                done()
            }, 0);
        });
    });

    describe('onSubmit', () => {
        beforeEach(() => {
            const dismissFn = jest.fn(() => Promise.resolve());
            const presentFn = jest.fn(() => Promise.resolve());
            mockCommonUtilService.getLoader = jest.fn(() => ({
                present: presentFn,
                dismiss: dismissFn,
            })) as any;
        });
        it('should show toast if form is invalid', () => {
            // arrange
            guestEditPage.isFormValid = false;
            mockCommonUtilService.translateMessage = jest.fn(() => 'translated');
            // act
            guestEditPage.onSubmit();
            // assert
            expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('translated');
        });
        it('should show toast if userType is not there', (done) => {
            // arrange
            guestEditPage.isFormValid = true;
            guestEditPage.profileSettingsForms = {
                value: {
                    userType: ''
                },
            } as any;
            // act
            guestEditPage.onSubmit();
            // assert
            setTimeout(() => {
                expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('USER_TYPE_SELECT_WARNING');
                done();
            }, 0);
        });
        it('should show toast if name is not there', (done) => {
            // arrange
            guestEditPage.isFormValid = true;
            guestEditPage.profileSettingsForms = {
                value: {
                    profileType: 'userType'
                },
                getRawValue: jest.fn(() => ({name: '' }))
            } as any;
            mockCommonUtilService.translateMessage = jest.fn((arg) => {
                let value;
                switch (arg) {
                    case 'PLEASE_SELECT':
                        value = 'translated1';
                        break;
                    case 'FULL_NAME':
                        value = 'translated2';
                        break;
                }
                return value;
            }
            );
            // act
            guestEditPage.onSubmit();
            // assert
            setTimeout(() => {
                expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('translated1', false, 'red-toast');
                done();
            }, 0);
        });
        it('should show toast if boards are not there', (done) => {
            // arrange
            guestEditPage.isFormValid = true;
            guestEditPage.profileSettingsForms = {
                value: {
                    syllabus: [],
                    profileType: 'userType',
                    boards: []
                },
                getRawValue: jest.fn(() => ({name: 'name'}))
            } as any;
            mockCommonUtilService.translateMessage = jest.fn((arg) => {
                let value;
                switch (arg) {
                    case 'PLEASE_SELECT':
                        value = 'translated1';
                        break;
                    case 'BOARD':
                        value = 'translated2';
                        break;
                }
                return value;
            }
            );
            mockAppGlobalService.generateSaveClickedTelemetry = jest.fn();
            // act
            guestEditPage.onSubmit();
            // assert
            setTimeout(() => {
                expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('translated1', false, 'red-toast');
                done();
            }, 0);
        });
        it('should show toast if medium is not there', (done) => {
            // arrange
            guestEditPage.isFormValid = true;
            guestEditPage.profileSettingsForms = {
                value: {
                    syllabus: [],
                    userType: 'userType',
                    boards: ['board'],
                    medium: [],
                    profileType: ProfileType.TEACHER,
                    name: 'name'
                },
                getRawValue: jest.fn(() => '')
            } as any;
            guestEditPage.supportedProfileAttributes = {
                medium: ['sample-medium']
            } as any;
            mockCommonUtilService.translateMessage = jest.fn((arg) => {
                let value;
                switch (arg) {
                    case 'PLEASE_SELECT':
                        value = 'translated1';
                        break;
                    case 'MEDIUM':
                        value = 'translated2';
                        break;
                }
                return value;
            }
            );
            mockAppGlobalService.generateSaveClickedTelemetry = jest.fn();
            // act
            guestEditPage.onSubmit();
            // assert
            setTimeout(() => {
                expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('translated1', false, 'red-toast');
                expect(mockCommonUtilService.translateMessage).toHaveBeenNthCalledWith(1, 'FULL_NAME');
                expect(mockCommonUtilService.translateMessage).toHaveBeenNthCalledWith(2, 'PLEASE_SELECT', undefined);
                // expect(mockAppGlobalService.generateSaveClickedTelemetry).toHaveBeenCalled();
                done();
            }, 0);
        });
        it('should show toast if grades are not there', (done) => {
            // arrange
            guestEditPage.isFormValid = true;
            guestEditPage.profileSettingsForms = {
                value: {
                    syllabus: [],
                    userType: 'userType',
                    boards: ['board'],
                    medium: ['medium'],
                    grades: [],
                    profileType: ProfileType.TEACHER,
                },
                getRawValue: jest.fn(() => ({name: 'name' }))
            } as any;
            mockCommonUtilService.translateMessage = jest.fn((arg) => {
                let value;
                switch (arg) {
                    case 'PLEASE_SELECT':
                        value = 'translated1';
                        break;
                    case 'CLASS':
                        value = 'translated2';
                        break;
                }
                return value;
            }
            );
            guestEditPage.supportedProfileAttributes = {
                gradeLevel: ['class-1']
            } as any;
            mockAppGlobalService.generateSaveClickedTelemetry = jest.fn();
            // act
            guestEditPage.onSubmit();
            // assert
            setTimeout(() => {
                expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('translated1', false, 'red-toast');
                expect(mockCommonUtilService.translateMessage).toHaveBeenNthCalledWith(1, 'CLASS');
                expect(mockCommonUtilService.translateMessage).toHaveBeenNthCalledWith(2, 'PLEASE_SELECT', 'translated2');
                expect(mockAppGlobalService.generateSaveClickedTelemetry).toHaveBeenCalled();
                done();
            }, 0);
        });
        it('should call submitNewUserForm if new user', (done) => {
            // arrange
            guestEditPage.isNewUser = true;
            guestEditPage.profileSettingsForms = {
                value: {
                    syllabus: [],
                    userType: 'userType',
                    boards: ['board'],
                    medium: ['medium'],
                    grades: ['grade'],
                    profileType: ProfileType.TEACHER,
                    name: 'sample-name'
                },
                getRawValue: jest.fn(() => ({name: "name" }))
            } as any;
            mockAppGlobalService.generateSaveClickedTelemetry = jest.fn();
            // act
            guestEditPage.onSubmit();
            // assert
            setTimeout(() => {
                expect(mockAppGlobalService.generateSaveClickedTelemetry).toHaveBeenCalled();
                done();
            }, 0);
        });
        it('should call submitEditForm if not new user', (done) => {
                // arrange
                guestEditPage.isNewUser = false;
                guestEditPage.profileSettingsForms = {
                    value: {
                        syllabus: [],
                        userType: 'userType',
                        boards: ['board'],
                        medium: ['medium'],
                        grades: ['grade'],
                        profileType: ProfileType.TEACHER,
                        name: 'sample-name'
                    },
                    getRawValue: jest.fn(() => ({name: "name" }))
                } as any;
                const dismissFn = jest.fn(() => Promise.resolve());
                const presentFn = jest.fn(() => Promise.resolve());
                mockCommonUtilService.getLoader = jest.fn(() => Promise.resolve({
                    present: presentFn,
                    dismiss: dismissFn,
                })) as any;
                mockAppGlobalService.generateSaveClickedTelemetry = jest.fn();
                guestEditPage.gradeList = [{code: 'class-1', name: 'class-1'}];
                mockProfileService.updateProfile = jest.fn(() => throwError({errorCode: '404'}));
                mockCommonUtilService.translateMessage = jest.fn(() => 'sample-message');
                mockCommonUtilService.showToast = jest.fn();
                // act
                guestEditPage.onSubmit();
                // assert
                setTimeout(() => {
                    expect(mockAppGlobalService.generateSaveClickedTelemetry).toHaveBeenCalled();
                    expect(mockProfileService.updateProfile).toHaveBeenCalled();
                    expect(mockCommonUtilService.translateMessage).toHaveBeenCalled();
                    expect(mockCommonUtilService.showToast).toHaveBeenCalled();
                    done();
                }, 0);
            });
    });

    describe('validateName', () => {
        it('should validate name ', () => {
            // arrange
            guestEditPage.profileSettingsForms = {
                getRawValue: jest.fn(() => ({name: '', value: {profileType: ''}}))
            }
            // act
            guestEditPage.validateName();
        })
        it('should validate name, when it returns a raw value ', () => {
            // arrange
            guestEditPage.profileSettingsForms = {
                getRawValue: jest.fn(() => ({name: 'some_name', value: {profileType: ''}}))
            }
            // act
            guestEditPage.validateName();
        })
    })

    describe('extractProfileForTelemetry', () => {
        it('should extract profile for telemetry', () => {
            // arrange
            // act
            guestEditPage.extractProfileForTelemetry('')
        })
    })

    describe('submitEditForm', () => {
        it('should update profile for courrent user', (done) => {
            // arrange
            const formVal = {
                boards: ['sample-board'],
                medium: ['english', 'tamil'],
                subjects: [],
                grades: ['class-1'],
                syllabus: ['sample-board'],
                profileType: 'teacher',
                name: 'guest'
            };
            guestEditPage.gradeList = [{code: 'class-1', name: 'class-1'}];
            mockProfileService.updateProfile = jest.fn(() => of({})) as any;
            const dismissFn = jest.fn(() => Promise.resolve());
            const presentFn = jest.fn(() => Promise.resolve());
            mockCommonUtilService.getLoader = jest.fn(() => Promise.resolve({
                present: presentFn,
                dismiss: dismissFn,
            })) as any;
            mockCommonUtilService.showToast = jest.fn();
            mockTelemetryGeneratorService.generateInteractTelemetry = jest.fn();
            guestEditPage.isCurrentUser = true;
            mockCommonUtilService.handleToTopicBasedNotification = jest.fn();
            // act
            guestEditPage.submitEditForm(formVal, {dismiss: dismissFn});
            // assert
            setTimeout(() => {
                expect(mockProfileService.updateProfile).toHaveBeenCalled();
                expect(dismissFn).toHaveBeenCalled();
                expect(mockCommonUtilService.showToast).toHaveBeenCalled();
                expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalled();
                expect(guestEditPage.isCurrentUser).toBeTruthy();
                expect(mockCommonUtilService.handleToTopicBasedNotification).toHaveBeenCalled();
                done();
            }, 0);
        });

        it('should update profile for not courrent user and gradeCode is different', (done) => {
            // arrange
            const formVal = {
                boards: ['sample-board'],
                medium: ['english', 'tamil'],
                subjects: [],
                grades: ['class-1'],
                syllabus: ['sample-board'],
                profileType: 'teacher',
                name: 'guest'
            };
            guestEditPage.gradeList = [{code: 'class-1', name: 'class'}];
            mockProfileService.updateProfile = jest.fn(() => of({})) as any;
            const dismissFn = jest.fn(() => Promise.resolve());
            const presentFn = jest.fn(() => Promise.resolve());
            mockCommonUtilService.getLoader = jest.fn(() => Promise.resolve({
                present: presentFn,
                dismiss: dismissFn,
            })) as any;
            mockCommonUtilService.showToast = jest.fn();
            mockTelemetryGeneratorService.generateInteractTelemetry = jest.fn();
            guestEditPage.isCurrentUser = false;
            mockLocation.back = jest.fn();
            // act
            guestEditPage.submitEditForm(formVal, {dismiss: dismissFn});
            // assert
            setTimeout(() => {
                expect(mockProfileService.updateProfile).toHaveBeenCalled();
                expect(dismissFn).toHaveBeenCalled();
                expect(mockCommonUtilService.showToast).toHaveBeenCalled();
                expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalled();
                expect(guestEditPage.isCurrentUser).toBeFalsy();
                expect(mockLocation.back).toHaveBeenCalled();
                done()
            }, 0);
            });

            it('should failed to update profile for ERROR', (done) => {
                // arrange
            const formVal = {
                boards: ['sample-board'],
                medium: ['english', 'tamil'],
                subjects: [],
                grades: [],
                syllabus: ['sample-board'],
                profileType: 'teacher',
                name: 'guest'
            };
            guestEditPage.gradeList = [{code: 'class-1', name: 'class-1'}];
            mockProfileService.updateProfile = jest.fn(() => throwError({errorCode: '404'}));
            mockCommonUtilService.translateMessage = jest.fn(() => 'sample-message');
            mockCommonUtilService.showToast = jest.fn();
            // act
            guestEditPage.submitEditForm(formVal, false);
            // assert
            setTimeout(() => {
                expect(mockProfileService.updateProfile).toHaveBeenCalled();
                expect(mockCommonUtilService.translateMessage).toHaveBeenCalled();
                expect(mockCommonUtilService.showToast).toHaveBeenCalled();
                done()
            }, 0);
        });
    });

    describe('refreshSegmentTags', () => {
        it('should refresh SegmentTags', () => {
            // arrange
            mockProfileService.getActiveSessionProfile = jest.fn(() => of({
                board: ['sample-board'],
                medium: ['sample-medium'],
                grade: ['sample-grade'],
                syllabus: ['sample-board'],
                profileType: 'sample-type'
            }));
            mockSegmentationTagService.evalCriteria = jest.fn();
            global.window.segmentation = {
                init: jest.fn(),
                SBTagService: {
                    pushTag: jest.fn(),
                    removeAllTags: jest.fn(),
                    restoreTags: jest.fn()
                }
            };
            // act
            guestEditPage.refreshSegmentTags();
            // assert
            expect(mockProfileService.getActiveSessionProfile).toHaveBeenCalled();
        });
    })

    describe('publishProfileEvents', () => {
        it('should navigate to signin page for admin user', (done) => {
            // arrange
            guestEditPage.profileSettingsForms = {
                valid: true,
                value: {profileType: ''}
            } as any
            const formVal = {
                boards: ['sample-board'],
                medium: ['english', 'tamil'],
                subjects: ['subjects'],
                grades: ['class1'],
                syllabus: ['sample-board'],
                profileType: ProfileType.ADMIN,
                name: 'guest'
            };
            mockEvents.publish = jest.fn();
            guestEditPage.previousProfileType = 'student';
            mockSharedPreferences.putString = jest.fn(() => of(undefined));
            mockRouter.navigate = jest.fn(() => Promise.resolve(true));
            // act
            guestEditPage.publishProfileEvents(formVal);
            // assert
            expect(mockEvents.publish).toHaveBeenNthCalledWith(1, 'onboarding-card:completed', { isOnBoardingCardCompleted: true });
            expect(mockEvents.publish).toHaveBeenNthCalledWith(2, 'refresh:profile');
            expect(mockEvents.publish).toHaveBeenNthCalledWith(3, 'refresh:onboardingcard');
            expect(mockSharedPreferences.putString).toHaveBeenNthCalledWith(1, PreferenceKey.SELECTED_USER_TYPE, formVal.profileType);
            expect(mockSharedPreferences.putString).toHaveBeenNthCalledWith(1, PreferenceKey.SELECTED_USER_TYPE,  ProfileType.ADMIN);
            setTimeout(() => {
                expect(mockRouter.navigate).toHaveBeenCalled();
                done();
            }, 0);
        });

        it('should navigate to previous page except admin', () => {
            // arrange
            const formVal = {
                boards: ['sample-board'],
                medium: ['english', 'tamil'],
                subjects: [],
                grades: ['class1'],
                syllabus: ['sample-board'],
                profileType: ProfileType.TEACHER,
                name: 'guest'
            };
            mockEvents.publish = jest.fn();
            guestEditPage.previousProfileType = ProfileType.TEACHER;
            mockSharedPreferences.putString = jest.fn(() => of(undefined));
            mockLocation.back = jest.fn();
            // act
            guestEditPage.publishProfileEvents(formVal);
            // assert
            expect(mockEvents.publish).toHaveBeenNthCalledWith(1, 'onboarding-card:completed', { isOnBoardingCardCompleted: true });
            expect(mockEvents.publish).toHaveBeenNthCalledWith(2, 'refresh:profile');
            expect(mockEvents.publish).toHaveBeenNthCalledWith(3, 'refresh:onboardingcard');
            expect(mockLocation.back).toHaveBeenCalled();
        });
    });

    describe('submitNewUserForm', () => {
        it('should cretae a new profile', (done) => {
            // arrange
            const formVal = {
                boards: ['sample-board'],
                medium: ['english', 'tamil'],
                subjects: ['subjects'],
                grades: ['class-1'],
                syllabus: ['sample-board'],
                profileType: ProfileType.ADMIN,
                name: 'guest'
            };
            guestEditPage.gradeList = [{code: 'class-1', name: 'class-1'}];
            mockProfileService.createProfile = jest.fn(() => of({}));
            mockCommonUtilService.translateMessage = jest.fn(() => '');
            mockCommonUtilService.showToast = jest.fn();
            mockTelemetryGeneratorService.generateInteractTelemetry = jest.fn();
            mockLocation.back = jest.fn();
            // act
            guestEditPage.submitNewUserForm(formVal, false);
            // assert
            setTimeout(() => {
                expect(mockProfileService.createProfile).toHaveBeenCalled();
                expect(mockCommonUtilService.translateMessage).toHaveBeenCalled();
                expect(mockCommonUtilService.showToast).toHaveBeenCalled();
                expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalled();
                expect(mockLocation.back).toHaveBeenCalled();
                done()
            }, 0);
        });

        it('should cretae a new profile', (done) => {
            // arrange
            const formVal = {
                boards: ['sample-board'],
                medium: ['english', 'tamil'],
                subjects: ['subjects'],
                grades: ['class-1'],
                syllabus: ['sample-board'],
                profileType: ProfileType.ADMIN,
                name: 'guest'
            };
            guestEditPage.gradeList = [{code: 'class-1', name: 'class1'}];
            mockProfileService.createProfile = jest.fn(() => throwError({}));
            mockCommonUtilService.translateMessage = jest.fn(() => '');
            mockCommonUtilService.showToast = jest.fn();
            // act
            guestEditPage.submitNewUserForm(formVal, false);
            // assert
            expect(mockProfileService.createProfile).toHaveBeenCalled();
            setTimeout(() => {
                expect(mockCommonUtilService.translateMessage).toHaveBeenCalled();
                expect(mockCommonUtilService.showToast).toHaveBeenCalled();
                done()
            }, 0);
        });
    });

    describe('setCategoriesTerms', () => {
        it('should set categorry terms ', () => {
            // arrange
            mockFrameworkUtilService.getFrameworkCategoryTerms = jest.fn(() => of([{name: 'name', code: '2', identifier: 'id', index: 2, category: '', status: ''}]))
            // act
            guestEditPage.setCategoriesTerms()
            // assert
        })
    });
});
