import { TranslationKey } from '@/types/LanguageType';

import { ComponentType, useEffect, useMemo, useState } from 'react';
import { InteractionManager, View } from 'react-native';

import { useForm } from '@/hooks/useForm';
import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { periodsToHours } from '@/utils/periodsToHours';

import { AdFormDataType } from '@/context/FormContext';

import { ProgressBar } from '@/components/common/bars/ProgressBar';
import { AdAllDatesStep } from '@/components/forms/ad/AdAllDatesStep';
import { AdDayTimeStep } from '@/components/forms/ad/AdDayTimeStep';
import { AdDetailsStep } from '@/components/forms/ad/AdDetailsStep';
import { AdExceptionsStep } from '@/components/forms/ad/AdExceptionsStep';
import { AdMapStep } from '@/components/forms/ad/AdMapStep';
import { AdMediaStep } from '@/components/forms/ad/AdMediaStep';
import { AdTypeStep } from '@/components/forms/ad/AdTypeStep';
import { AdWeekDaysStep } from '@/components/forms/ad/AdWeekDaysStep';
import { CustomAlert } from '@/components/modals/CustomAlert';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { AdService } from '@/services/api/services/adService';
import { SetAvailabilityDto } from '@/services/api/services/dto/ad.dto';
import { MediaService } from '@/services/api/services/mediaService';

type StepComponentProps = {
  errors: Record<string, string>;
};

const buildAvailabilityPayload = (
  data: AdFormDataType,
): SetAvailabilityDto => {
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  const weekdayHours: Record<string, number[]> = {};
  if (data.adType === 'product') {
    data.weekDays.forEach((selected, idx) => {
      if (!selected) return;
      const hours = periodsToHours(data.weekDaysTime[idx]).map(h =>
        parseInt(h.split('-')[0]),
      );
      weekdayHours[(idx + 1).toString()] = hours;
    });
  } else {
    for (let i = 1; i <= 7; i++) {
      weekdayHours[i.toString()] = Array.from({ length: 24 }, (_, h) => h);
    }
  }
  return {
    periods: [
      {
        valid_from: fmt(data.firstDate!),
        valid_until: fmt(data.endDate!),
        weekday_hours: weekdayHours,
      },
    ],
  };
};

export const CreateAdForm = () => {
  const { l } = useLanguage();
  const { navigate } = useHistory();
  const form = useForm();
  const { colors } = useTheme();

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (form.AdFormData.adType == 'product') {
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
  }, [form.AdFormData.adType]);

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
        if (!form.AdFormData.adType) {
          stepErrors.adType = l.errorAdTypeNull;
        }
        break;

      case 'adDetailsStep': {
        const title = form.AdFormData.title || '';
        const description = form.AdFormData.description || '';

        if (!title.trim()) {
          stepErrors.title = l.errorTitleNull;
        } else if (title.length < 5) {
          stepErrors.title = l.errorTitleTooShort;
        } else if (title.length > 40) {
          stepErrors.title = l.errorTitleTooLong;
        }

        if (!form.AdFormData.quantity) {
          stepErrors.quantity = l.errorQuantityNull;
        } else if (form.AdFormData.quantity <= 0) {
          stepErrors.quantity = l.errorQuantityZeroOrLess;
        }

        if (description && description.length < 10) {
          stepErrors.description = l.errorDescriptionTooShort;
        } else if (description.length > 500) {
          stepErrors.description = l.errorDescriptionTooLong;
        }

        form.AdFormData.specifications.forEach(item => {
          const keyFilled = item.key.trim().length > 0;
          const valueFilled = item.value.trim().length > 0;
          if (keyFilled !== valueFilled) {
            stepErrors.specifications = l.errorSpecificationIncomplete;
          }
        });

        if (!form.AdFormData.categoryId) {
          stepErrors.categoryId = l.errorCategoryIdNull;
        }

        if (!form.AdFormData.cost) {
          stepErrors.cost = l.errorCostNull;
        } else if (form.AdFormData.cost <= 0) {
          stepErrors.cost = l.errorCostZeroOrLess;
        }

        if (!form.AdFormData.minHoursInterval) {
          stepErrors.minInterval = l.errorMinIntervalNull;
        } else if (form.AdFormData.minHoursInterval <= 0) {
          stepErrors.minInterval = l.errorMinIntervalZeroOrLess;
        } else if (form.AdFormData.minHoursInterval > 24) {
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
        if (!form.AdFormData.previewImage) {
          stepErrors.previewImage = l.errorPreviewImageNull;
        }
        if (form.AdFormData.uriMedias?.length > 10) {
          stepErrors.uriMedias = l.errorMediaArrayTooLong;
        }
        break;

      case 'adMapStep':
        if (!form.AdFormData.address) {
          stepErrors.address = l.errorAddressNull;
        }
        break;

      case 'adAllDatesStep': {
        const { firstDate, endDate } = form.AdFormData;
        if (!firstDate || !endDate) {
          stepErrors.endDate = l.errorDatePeriodNull;
        } else if (endDate < firstDate) {
          stepErrors.endDate = l.errorEndDateStartDateComparison;
        }
        break;
      }

      case 'adWeekDaysStep':
        if (!form.AdFormData.weekDays.some(item => item)) {
          stepErrors.weekDays = l.errorWeekDaysNull;
        }
        break;

      case 'adDayTimeStep': {
        const minHours = form.AdFormData.minHoursInterval ?? 1;
        form.AdFormData.weekDaysTime.forEach((weekDay, index) => {
          if (weekDay.length === 0 && form.AdFormData.weekDays[index]) {
            stepErrors.weekDaysTime = l.errorDayTimeNull;
          }
        });
        const hasShortDayPeriod = form.AdFormData.weekDaysTime.some(
          (weekDay, index) =>
            form.AdFormData.weekDays[index] &&
            weekDay.some(period => {
              const startH = parseInt(period.startTime.split('-')[0]);
              const endH = period.endTime === '24' ? 24 : parseInt(period.endTime.split('-')[0]);
              return endH - startH < minHours;
            }),
        );
        if (hasShortDayPeriod) {
          stepErrors.weekDaysTime = l.errorTimePeriodMinInterval;
        }
        break;
      }

      case 'adExceptionsStep': {
        const minHours = form.AdFormData.minHoursInterval ?? 1;
        const hasShortExceptionPeriod = (form.AdFormData.exceptions ?? []).some(ex =>
          ex.timings.some(period => {
            const startH = parseInt(period.startTime.split('-')[0]);
            const endH = period.endTime === '24' ? 24 : parseInt(period.endTime.split('-')[0]);
            return endH - startH < minHours;
          }),
        );
        if (hasShortExceptionPeriod) {
          stepErrors.exceptions = l.errorTimePeriodMinInterval;
        }
        break;
      }
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

    setIsSubmitting(true);
    try {
      const data = form.AdFormData;
      const validSpecs = data.specifications.filter(
        s => s.key.trim() && s.value.trim(),
      );

      const listing = await AdService.createAd({
        title: data.title,
        description: data.description,
        category_id: parseInt(data.categoryId!),
        price_per_hour: data.cost!,
        quantity: data.quantity!,
        buffer_hours: data.minHoursInterval ?? undefined,
        lat: data.latitude ?? undefined,
        lon: data.longitude ?? undefined,
        address: data.address ?? undefined,
        attributes: validSpecs.length > 0 ? validSpecs : undefined,
      });
      const listingId = listing.listing_id;

      if (data.previewImage?.url) {
        await MediaService.uploadMedia(listingId, data.previewImage.url, 'image/jpeg', 0);
      }

      if (data.uriMedias.length > 0) {
        await Promise.all(
          data.uriMedias.map((m, i) =>
            MediaService.uploadMedia(
              listingId,
              m.url,
              m.mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
              i + 1,
            ),
          ),
        );
      }

      await AdService.setAvailability(
        listingId,
        buildAvailabilityPayload(data),
      );

      form.clear();
      navigate(
        { pathname: '/(tabs)/ads/[id]', params: { id: listingId } },
        false,
      );
    } catch {
      // global MutationCache.onError показывает тост
    } finally {
      setIsSubmitting(false);
    }
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
  }, [form.AdFormData.adType]);

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
          disabled={isSubmitting}
        />

        <CustomButton
          type={form.currentStep != form.totalSteps ? 'primary' : 'green'}
          text={form.currentStep != form.totalSteps ? l.btnNext : l.btnFinish}
          onPress={handleNextStep}
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
};
