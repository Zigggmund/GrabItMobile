import { ProductType } from '@/types/entities/AdType';
import { MediaType } from '@/types/MediaType';
import { ExceptionDayType, TimePeriodType } from '@/types/TimeType';

import { createContext } from 'react';

export type AdCreationFormDataType = {
  adType?: ProductType;

  title: string;
  quantity?: number | null;
  description: string;
  specifications: string[];
  previewImage?: MediaType | null;
  categoryId?: string | null;
  cost?: number | null;
  minInterval?: number | null;
  // cost: CostType[];
  uriMedias: MediaType[];

  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;

  firstDate?: Date | null;
  endDate?: Date | null;
  weekDays: Array<boolean>;
  // [monday, tuesday, ... sunday]
  // [['12 - 15', '18 - 20'], [...], [...], [...], [...], [...], [...] ]
  weekDaysTime: Array<Array<TimePeriodType>>;
  exceptions?: ExceptionDayType[] | null;
};

export type BookingFormDataType = {
  time?: Date | null;
};

interface FormContext {
  isFilled: boolean;
  totalSteps: number;
  currentStep: number;

  bookingFormData: BookingFormDataType;
  adCreationFormData: AdCreationFormDataType;
  changeAdCreationFormData: <K extends keyof AdCreationFormDataType>(
    key: K,
    value: AdCreationFormDataType[K],
  ) => void;
  changeBookingFormData: <K extends keyof BookingFormDataType>(
    key: K,
    value: BookingFormDataType[K],
  ) => void;

  goNextStep: () => void;
  goPreviousStep: () => void;
  setTotalSteps: (totalSteps: number) => void;
  clear: () => void;
  formGoBack: () => void;
  // shouldNavigateFromForm: () => Promise<boolean>;
}

export const FormContext = createContext<FormContext | null>(null);
