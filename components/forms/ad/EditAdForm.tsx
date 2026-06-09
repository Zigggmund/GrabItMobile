import { AdDetailsType } from '@/types/entities/AdType';

import { ComponentType, useEffect, useRef, useState } from 'react';
import { InteractionManager, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

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
// import { AdExceptionsStep } from '@/components/forms/ad/AdExceptionsStep';
import { AdMapStep } from '@/components/forms/ad/AdMapStep';
import { AdMediaStep } from '@/components/forms/ad/AdMediaStep';
import { AdWeekDaysStep } from '@/components/forms/ad/AdWeekDaysStep';
import { CustomAlert } from '@/components/modals/CustomAlert';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { AdService } from '@/services/api/services/adService';
import { SetAvailabilityDto } from '@/services/api/services/dto/ad.dto';
import { MediaService } from '@/services/api/services/mediaService';

const buildAvailabilityPayload = (data: AdFormDataType): SetAvailabilityDto => {
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  const weekdayHours: Record<string, number[]> = {};
  data.weekDays.forEach((selected, idx) => {
    if (!selected) return;
    const hours = periodsToHours(data.weekDaysTime[idx]).map(h =>
      parseInt(h.split('-')[0]),
    );
    weekdayHours[(idx + 1).toString()] = hours;
  });
  const endPlusOne = new Date(data.endDate!);
  endPlusOne.setDate(endPlusOne.getDate() + 1);
  return {
    periods: [
      {
        valid_from: fmt(data.firstDate!),
        valid_until: fmt(endPlusOne),
        weekday_hours: weekdayHours,
      },
    ],
  };
};

type StepComponentProps = { errors: Record<string, string> };

const STEPS: { key: string; component: ComponentType<StepComponentProps> }[] = [
  { key: 'adDetailsStep', component: AdDetailsStep },
  { key: 'adMapStep', component: AdMapStep },
  { key: 'adMediaStep', component: AdMediaStep },
  { key: 'adAllDatesStep', component: AdAllDatesStep },
  { key: 'adWeekDaysStep', component: AdWeekDaysStep },
  { key: 'adDayTimeStep', component: AdDayTimeStep },
];

interface Props {
  ad: AdDetailsType;
}

export const EditAdForm = ({ ad }: Props) => {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const { navigate, goBack } = useHistory();
  const form = useForm();
  const queryClient = useQueryClient();

  const originalMediaRef = useRef(ad.media.filter(m => m.id !== ad.previewImage?.id));
  const populated = useRef(false);

  useEffect(() => {
    if (populated.current) return;
    populated.current = true;

    form.clear();
    form.changeAdFormData('adType', 'product');
    form.changeAdFormData('title', ad.title);
    form.changeAdFormData('description', ad.description ?? '');
    form.changeAdFormData('cost', ad.rub_per_hour);
    form.changeAdFormData('categoryId', ad.categoryId);
    // form.changeAdFormData('quantity', ad.quantity);
    form.changeAdFormData('bufferHours', ad.bufferHours);
    form.changeAdFormData('latitude', ad.lat);
    form.changeAdFormData('longitude', ad.lon);
    form.changeAdFormData('address', ad.address);
    form.changeAdFormData('specifications', ad.specifications);
    form.changeAdFormData('previewImage', ad.previewImage);
    form.changeAdFormData('uriMedias', ad.media.filter(m => m.id !== ad.previewImage?.id));
  }, []);

  const adId = ad.id;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {},
  );

  const totalSteps = STEPS.length;
  const step = STEPS[currentStep - 1];
  const CurrentStepComponent = step.component;

  const validateStep = (stepKey: string): boolean => {
    const stepErrors: Record<string, string> = {};

    switch (stepKey) {
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

        // if (!form.AdFormData.quantity) {
        //   stepErrors.quantity = l.errorQuantityNull;
        // } else if (form.AdFormData.quantity <= 0) {
        //   stepErrors.quantity = l.errorQuantityZeroOrLess;
        // }

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
        break;
      }
      case 'adMapStep':
        if (!form.AdFormData.previewImage) {
          stepErrors.previewImage = l.errorPreviewImageNull;
        }
        if (!form.AdFormData.address) {
          stepErrors.address = l.errorAddressNull;
        }
        break;
      case 'adMediaStep':
        if (form.AdFormData.uriMedias.length > 10) {
          stepErrors.uriMedias = l.errorMediaArrayTooLong;
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
        const minHours = form.AdFormData.bufferHours ?? 1;
        form.AdFormData.weekDaysTime.forEach((weekDay, index) => {
          if (weekDay.length === 0 && form.AdFormData.weekDays[index]) {
            stepErrors.weekDaysTime = l.errorDayTimeNull;
          }
        });
        const hasShort = form.AdFormData.weekDaysTime.some(
          (weekDay, index) =>
            form.AdFormData.weekDays[index] &&
            weekDay.some(period => {
              const startH = parseInt(period.startTime.split('-')[0]);
              const endH = period.endTime === '24' ? 24 : parseInt(period.endTime.split('-')[0]);
              return endH - startH < minHours;
            }),
        );
        if (hasShort) stepErrors.weekDaysTime = l.errorTimePeriodMinInterval;
        break;
      }

    }

    setErrors(prev => ({ ...prev, [stepKey]: stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  const handleFinish = async () => {
    const confirmed = await CustomAlert({
      message: l.warningFormFinish,
      confirmation: l.confirmation,
      btnCancel: l.btnCancel,
      btnConfirm: l.btnConfirm,
    });
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const data = form.AdFormData;
      const validSpecs = data.specifications.filter(
        s => s.key.trim() && s.value.trim(),
      );

      await AdService.updateAd(adId, {
        title: data.title,
        description: data.description,
        category_id: parseInt(data.categoryId!),
        price_per_hour: data.cost!,
        quantity: data.quantity ?? 1,
        buffer_hours: data.bufferHours ?? undefined,
        lat: data.latitude ?? undefined,
        lon: data.longitude ?? undefined,
        address: data.address ?? undefined,
        attributes: validSpecs.length > 0 ? validSpecs : undefined,
      });

      const currentMedia = data.uriMedias;
      const removedMedia = originalMediaRef.current.filter(
        om => !currentMedia.find(cm => cm.id === om.id),
      );
      const newLocalMedia = currentMedia.filter(m => !m.url.startsWith('http'));

      await Promise.allSettled(
        removedMedia.map(m => MediaService.deleteMedia(adId, String(m.id))),
      );
      const existingOnServer = currentMedia.filter(m => m.url.startsWith('http'));
      await Promise.allSettled(
        newLocalMedia.map((m, i) =>
          MediaService.uploadMedia(
            adId,
            m.url,
            m.mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
            existingOnServer.length + 2 + i, // +1 preview + после существующих
          ),
        ),
      );

      await AdService.setAvailability(adId, buildAvailabilityPayload(data));

      form.clear();
      await queryClient.invalidateQueries({ queryKey: ['ad', adId] });
      navigate({ pathname: '/(tabs)/ads/[id]', params: { id: adId } }, false);
    } catch {
      // глобальный MutationCache.onError показывает тост
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    const isValid = validateStep(step.key);
    if (!isValid) return;

    InteractionManager.runAfterInteractions(() => {
      if (currentStep < totalSteps) {
        setCurrentStep(s => s + 1);
      } else {
        handleFinish();
      }
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    } else {
      goBack();
    }
  };

  return (
    <View className="mb-2 mx-4 flex-1">
      <View className="gap-4">
        <ProgressBar progress={currentStep} length={totalSteps} />
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className="text-26 pt-6 pb-2 text-center"
        >
          {l.editAdTitle}
        </CustomText>
      </View>

      <View className="flex-1">
        <CurrentStepComponent errors={errors[step.key] || {}} />
      </View>

      <View className="flex-row justify-between gap-2 pt-2">
        <CustomButton
          type={currentStep !== 1 ? 'primary' : 'red'}
          text={currentStep !== 1 ? l.btnBack : l.btnCancel}
          onPress={handleBack}
          disabled={isSubmitting}
        />
        <CustomButton
          type={currentStep !== totalSteps ? 'primary' : 'green'}
          text={currentStep !== totalSteps ? l.btnNext : l.btnSave}
          onPress={handleNext}
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
};
