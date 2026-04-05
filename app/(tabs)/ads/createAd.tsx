import { FormProvider } from '@/context/FormProvider';

import { CreateAdForm } from '@/components/forms/adCreation/CreateAdForm';
import ScreenContainer from '@/components/layout/ScreenContainer';

export default function CreateAd() {
  return (
    <ScreenContainer>
      <FormProvider>
        <CreateAdForm />
      </FormProvider>
    </ScreenContainer>
  );
}
