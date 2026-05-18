export type LoginFinishDto = {
  username: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other' | null;
  phoneNumber: string | null;
  birthDate: string;
};