import { Alert } from 'react-native';

interface CustomAlertProps {
  message: string;
  confirmation: string;
  btnCancel: string;
  btnConfirm: string;
}

export const CustomAlert = ({
  message,
  confirmation,
  btnCancel,
  btnConfirm,
}: CustomAlertProps): Promise<boolean> => {
  return new Promise(resolve => {
    Alert.alert(confirmation, message, [
      {
        text: btnCancel,
        onPress: () => resolve(false),
        style: 'cancel',
      },
      {
        text: btnConfirm,
        onPress: () => resolve(true),
      },
    ]);
  });
};
