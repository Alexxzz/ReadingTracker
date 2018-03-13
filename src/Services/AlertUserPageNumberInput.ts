import { AlertIOS, AlertIOSButton } from 'react-native';
import { UserPageNumberInput } from './UserPageNumberInput';

export class AlertUserPageNumberInput implements UserPageNumberInput {
  promptPageNumber(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const okButton: AlertIOSButton = {
        text: 'Ok',
        onPress: (text?: string) => resolve(text),
      };
      const cancelButton: AlertIOSButton = {
        text: 'Cancel',
        onPress: () => reject('User cancelled'),
        style: 'cancel',
      };

      AlertIOS.prompt(
        '',
        'Please enter the page you stopped today',
        [okButton, cancelButton],
      );
    });
  }
}
