import { ComponentType, useEffect, useMemo, useState } from 'react';
import { InteractionManager, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useForm } from '@/hooks/useForm';
import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { TranslationKey } from '@/context/LanguageContext';

import { ProgressBar } from '@/components/common/bars/ProgressBar';
import { AdAllDatesStep } from '@/components/forms/adCreation/AdAllDatesStep';
import { AdDayTimeStep } from '@/components/forms/adCreation/AdDayTimeStep';
import { AdDetailsStep } from '@/components/forms/adCreation/AdDetailsStep';
import { AdExceptionsStep } from '@/components/forms/adCreation/AdExceptionsStep';
import { AdMapStep } from '@/components/forms/adCreation/AdMapStep';
import { AdMediaStep } from '@/components/forms/adCreation/AdMediaStep';
import { AdTypeStep } from '@/components/forms/adCreation/AdTypeStep';
import { AdWeekDaysStep } from '@/components/forms/adCreation/AdWeekDaysStep';
import { CustomAlert } from '@/components/modals/CustomAlert';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

type StepComponentProps = {
  errors: Record<string, string>;
};

export const CreateAdForm = () => {
  const { l } = useLanguage();
  const { navigate } = useHistory();
  const form = useForm();
  const { colors } = useTheme();

  const adId = 1;

  const steps: {
    key: TranslationKey;
    component: ComponentType<StepComponentProps>;
  }[] = useMemo(() => {
    const baseSteps = [
      { key: 'adTypeStep', component: AdTypeStep },
      { key: 'adDetailsStep', component: AdDetailsStep },
      { key: 'adMediaStep', component: AdMediaStep },
      { key: 'adMapStep', component: AdMapStep },
      { key: 'adAllDatesStep', component: AdAllDatesStep },
    ] as const;

    let productSteps: {
      key: TranslationKey;
      component: ComponentType<StepComponentProps>;
    }[] = [];
    if (form.adCreationFormData.adType == 'product') {
      productSteps = [
        {
          key: 'adWeekDaysStep',
          component: AdWeekDaysStep,
        },
        { key: 'adDayTimeStep', component: AdDayTimeStep },
      ] as const;
    }

    const exceptionStep = {
      key: 'adExceptionsStep',
      component: AdExceptionsStep,
    } as const;

    return [...baseSteps, ...productSteps, exceptionStep];
  }, [form.adCreationFormData.adType]);

  const currentStepIndex = Math.min(form.currentStep - 1, steps.length - 1);
  const CurrentStepKey = steps[currentStepIndex].key;
  const CurrentStepComponent = steps[currentStepIndex].component;

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {},
  );
  const validateStep = (stepKey: string) => {
    const stepErrors: Record<string, string> = {};

    switch (stepKey) {
      case 'adTypeStep':
        if (!form.adCreationFormData.adType) {
          stepErrors.adType = l.errorAdTypeNull;
        }
        break;

      case 'adDetailsStep': {
        const title = form.adCreationFormData.title || '';
        const description = form.adCreationFormData.description || '';

        if (!title.trim()) {
          stepErrors.title = l.errorTitleNull;
        } else if (title.length < 5) {
          stepErrors.title = l.errorTitleTooShort;
        } else if (title.length > 40) {
          stepErrors.title = l.errorTitleTooLong;
        }

        if (description && description.length < 10) {
          stepErrors.description = l.errorDescriptionTooShort;
        } else if (description.length > 500) {
          stepErrors.description = l.errorDescriptionTooLong;
        }

        form.adCreationFormData.specifications.forEach(item => {
          if (item.length > 100)
            stepErrors.specifications = l.errorSpecificationTooLong;
          if (item.length < 5)
            stepErrors.specifications = l.errorSpecificationTooShort;
        });

        if (!form.adCreationFormData.categoryId) {
          stepErrors.categoryId = l.errorCategoryIdNull;
        }

        if (!form.adCreationFormData.cost) {
          stepErrors.cost = l.errorCostNull;
        } else if (form.adCreationFormData.cost <= 0) {
          stepErrors.cost = l.errorCostZeroOrLess;
        }

        if (!form.adCreationFormData.minInterval) {
          stepErrors.minInterval = l.errorMinIntervalNull;
        } else if (form.adCreationFormData.minInterval <= 0) {
          stepErrors.minInterval = l.errorMinIntervalZeroOrLess;
        } else if (form.adCreationFormData.minInterval > 24) {
          stepErrors.minInterval = l.errorMinIntervalTooBig;
        }
        // if (
        //   !form.adCreationFormData.cost ||
        //   form.adCreationFormData.cost.length === 0
        // ) {
        //   stepErrors.cost = l.errorCostNull;
        // }

        break;
      }

      case 'adMediaStep':
        if (!form.adCreationFormData.previewImage) {
          stepErrors.previewImage = l.errorPreviewImageNull;
        }
        if (form.adCreationFormData.uriMedias?.length > 10) {
          stepErrors.uriMedias = l.errorMediaArrayTooLong;
        }
        break;

      case 'adMapStep':
        if (!form.adCreationFormData.address) {
          stepErrors.address = l.errorAddressNull;
        }
        break;

      case 'adAllDatesStep': {
        const { firstDate, endDate } = form.adCreationFormData;
        if (!firstDate || !endDate) {
          stepErrors.endDate = l.errorDatePeriodNull;
        } else if (endDate < firstDate) {
          stepErrors.endDate = l.errorEndDateStartDateComparison;
        }
        break;
      }

      case 'adWeekDaysStep':
        if (!form.adCreationFormData.weekDays.some(item => item)) {
          stepErrors.weekDays = l.errorWeekDaysNull;
        }
        break;

      case 'adDayTimeStep':
        form.adCreationFormData.weekDaysTime.forEach((weekDay, index) => {
          if (weekDay.length === 0 && form.adCreationFormData.weekDays[index]) {
            stepErrors.weekDaysTime = l.errorDayTimeNull;
          }
        });
        break;

      case 'adExceptionsStep':
        break;
    }

    console.log(stepErrors, stepKey);
    setErrors(prev => ({ ...prev, [stepKey]: stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };
  // const validators = {
  //   adTypeStep: () => !!form.adCreationFormData.adType,
  //   // Изменить?
  //   adDetailsStep: () =>
  //     !!form.adCreationFormData.title &&
  //     form.adCreationFormData.title.length > 4 &&
  //     form.adCreationFormData.title.length < 30 &&
  //     !!form.adCreationFormData.description &&
  //     form.adCreationFormData.description.length < 200 &&
  //     !!form.adCreationFormData.address &&
  //     !!form.adCreationFormData.previewImage &&
  //     !!form.adCreationFormData.categoryId &&
  //     !!form.adCreationFormData.cost &&
  //     form.adCreationFormData.cost.length > 0 &&
  //     !!form.adCreationFormData.media &&
  //     !!form.adCreationFormData.specifications,
  //   allDatesStep: () => !!form.adCreationFormData.firstDate,
  //   weekDaysStep: () => !!form.adCreationFormData.weekDays,
  //   exceptionStep: () => true,
  // };

  const finish = async () => {
    const response = await CustomAlert({
      message: l.warningFormFinish,
      confirmation: l.confirmation,
      btnCancel: l.btnCancel,
      btnConfirm: l.btnConfirm,
    });
    if (!response) return;

    const results = form.adCreationFormData;
    console.log(results);
    console.log('===');
    AsyncStorage.setItem('adCreationFormData', JSON.stringify(results));
    console.log(AsyncStorage.getItem('adCreationFormData'));
    form.clear();
    navigate({ pathname: '/(tabs)/ads/[id]', params: { id: adId } }, false);
  };

  const handleNextStep = () => {
    const isValid = validateStep(CurrentStepKey);
    if (!isValid) return;

    InteractionManager.runAfterInteractions(() => {
      if (form.currentStep < form.totalSteps) {
        form.goNextStep();
      } else {
        finish();
      }
    });
  };

  useEffect(() => {
    form.setTotalSteps(steps.length);
  }, [form.adCreationFormData.adType]);

  return (
    <View className={'mb-2 mx-4 flex-1'}>
      <View className={'gap-4'}>
        <ProgressBar progress={form.currentStep} length={steps.length} />

        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-26 pt-6 pb-2 text-center'}
        >
          {l[CurrentStepKey]}
        </CustomText>
      </View>

      <View className={'flex-1'}>
        <CurrentStepComponent errors={errors[CurrentStepKey] || {}} />
      </View>

      <View className={'flex-row justify-between gap-2 pt-2'}>
        <CustomButton
          type={form.currentStep != 1 ? 'primary' : 'red'}
          text={form.currentStep != 1 ? l.btnBack : l.btnCancel}
          onPress={form.formGoBack}
        />

        <CustomButton
          type={form.currentStep != form.totalSteps ? 'primary' : 'green'}
          text={form.currentStep != form.totalSteps ? l.btnNext : l.btnFinish}
          onPress={handleNextStep}
        />
      </View>
    </View>
  );
};
