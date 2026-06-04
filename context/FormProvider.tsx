import { ActionType } from '@/types/SubscriptionType';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';

import {
  AdFormDataType,
  BookingFormDataType,
  FormContext,
} from '@/context/FormContext';

import { CustomAlert } from '@/components/modals/CustomAlert';

const initialAdData: AdFormDataType = {
  title: '',
  quantity: 1,
  description: '',
  specifications: [],
  uriMedias: [],
  weekDays: [false, false, false, false, false, false, false],
  weekDaysTime: [[], [], [], [], [], [], []],
  minHoursInterval: 1,
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const { l } = useLanguage();
  const history = useHistory();

  const [isFilled, setIsFilled] = useState(false);
  const [AdFormData, setAdFormData] = useState<AdFormDataType>(initialAdData);
  const [bookingFormData, setBookingFormData] = useState<BookingFormDataType>(
    {},
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(1);

  const goNextStep = () => {
    if (currentStep != totalSteps) setCurrentStep(prev => prev + 1);
  };
  const goPreviousStep = () => {
    if (currentStep != 1) setCurrentStep(prev => prev - 1);
  };

  const currentStepRef = useRef(currentStep);
  const isFilledRef = useRef(isFilled);
  const goPreviousStepRef = useRef(goPreviousStep);

  useEffect(() => {
    goPreviousStepRef.current = goPreviousStep;
  }, [goPreviousStep]);

  useEffect(() => {
    currentStepRef.current = currentStep;
    isFilledRef.current = isFilled;
  }, [currentStep, isFilled]);

  // useCallback для предотвращения повторного создания функции
  const attemptLeave = useCallback(async (action: ActionType) => {
    if (action == 'goBack') {
      if (currentStepRef.current > 1) {
        goPreviousStepRef.current();
        return 'handled';
      }
    }

    if (isFilledRef.current) {
      const response = await CustomAlert({
        message: l.warningFormExit,
        confirmation: l.confirmation,
        btnCancel: l.btnCancel,
        btnConfirm: l.btnConfirm,
      });
      if (!response) return 'block';
    }

    clear();
    return 'allow';
  }, []);

  // подписка нового/отписка старого
  useEffect(() => {
    history.subscribeAttemptLeave(attemptLeave);
    return () => history.unsubscribeAttemptLeave(attemptLeave);
  }, [attemptLeave]);

  const changeAdFormData = <K extends keyof AdFormDataType>(
    key: K,
    value: AdFormDataType[K],
  ) => {
    if (value && !isFilled) setIsFilled(true);
    setAdFormData(prev => ({ ...prev, [key]: value }));
  };
  const changeBookingFormData = <K extends keyof BookingFormDataType>(
    key: K,
    value: BookingFormDataType[K],
  ) => {
    if (value && !isFilled) setIsFilled(true);
    setBookingFormData(prev => ({ ...prev, [key]: value }));
  };

  const clear = () => {
    setAdFormData(initialAdData);
    setBookingFormData({});
    setCurrentStep(1);
    setIsFilled(false);
  };

  // const formGoBack = async () => {
  //   if (currentStep == 1) {
  //     if (isFilled) {
  //       const confirmed = await CustomAlert(l.warningFormExit);
  //       if (confirmed) {
  //         clear();
  //         history.goBack();
  //       }
  //       return;
  //     }
  //     history.goBack();
  //     return;
  //   }
  //   goPreviousStep();
  // };

  const formGoBack = async () => {
    console.log(1);
    if (currentStep == 1) {
      history.goBack();
    } else {
      goPreviousStep();
    }
  };

  // const shouldNavigateFromForm = async (): Promise<boolean> => {
  //   if (isFilled) {
  //     return await CustomAlert(l.warningFormExit);
  //   }
  //   return true;
  // };

  return (
    <FormContext.Provider
      value={{
        isFilled,
        goPreviousStep,
        goNextStep,
        clear,
        currentStep,
        totalSteps,
        setTotalSteps,
        // shouldNavigateFromForm,
        formGoBack,
        AdFormData,
        bookingFormData,
        changeAdFormData,
        changeBookingFormData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
