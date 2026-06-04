import { AdDetailsType } from '@/types/entities/AdType';

import { ComponentType, useEffect, useRef, useState } from 'react';
import { InteractionManager, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { useForm } from '@/hooks/useForm';
import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { ProgressBar } from '@/components/common/bars/ProgressBar';
import { AdDetailsStep } from '@/components/forms/ad/AdDetailsStep';
import { AdMapStep } from '@/components/forms/ad/AdMapStep';
import { AdMediaStep } from '@/components/forms/ad/AdMediaStep';
import { CustomAlert } from '@/components/modals/CustomAlert';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { AdService } from '@/services/api/services/adService';
import { MediaService } from '@/services/api/services/mediaService';

type StepComponentProps = { errors: Record<string, string> };

const STEPS: { key: string; component: ComponentType<StepComponentProps> }[] = [
  { key: 'adDetailsStep', component: AdDetailsStep },
  { key: 'adMapStep', component: AdMapStep },
  { key: 'adMediaStep', component: AdMediaStep },
  // { key: 'adMediaStep', component: EditAdMediaStep },
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

  const originalMediaRef = useRef(ad.media);
  const populated = useRef(false);

  useEffect(() => {
    if (populated.current) return;
    populated.current = true;

    form.changeAdFormData('adType', 'product');
    form.changeAdFormData('title', ad.title);
    form.changeAdFormData('description', ad.description ?? '');
    form.changeAdFormData('cost', ad.rub_per_hour);
    form.changeAdFormData('categoryId', ad.categoryId);
    form.changeAdFormData('quantity', ad.quantity);
    form.changeAdFormData('minHoursInterval', ad.minHoursInterval);
    form.changeAdFormData('latitude', ad.lat);
    form.changeAdFormData('longitude', ad.lon);
    form.changeAdFormData('address', ad.address);
    form.changeAdFormData('specifications', ad.specifications);
    form.changeAdFormData('previewImage', ad.previewImage);
    form.changeAdFormData('uriMedias', ad.media);
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
        quantity: data.quantity!,
        buffer_hours: data.minHoursInterval ?? undefined,
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

      await Promise.all(
        removedMedia.map(m => MediaService.deleteMedia(adId, String(m.id))),
      );
      await Promise.all(
        newLocalMedia.map((m, i) =>
          MediaService.uploadMedia(
            adId,
            m.url,
            m.mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
            currentMedia.findIndex(cm => cm.id === m.id),
          ),
        ),
      );

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
