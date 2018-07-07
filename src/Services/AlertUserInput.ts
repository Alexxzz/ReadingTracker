import { AlertIOS, AlertIOSButton } from 'react-native';
import { ISingleUserInput, IUserInputOptions } from './ISingleUserInput';

const UserCancelled = 'User cancelled';
const DefaultConfirmText = 'Ok';
const DefaultCancelText = 'Cancel';

export class AlertUserInput implements ISingleUserInput {
  public promptUser(options: IUserInputOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const okButton = this.okHandler(resolve, options);
      const cancelButton = this.cancelHandler(reject, options);

      AlertIOS.prompt('', options.promptText, [okButton, cancelButton]);
    });
  }

  private cancelHandler(reject: (reason: string) => void, options: IUserInputOptions): AlertIOSButton {
    return {
      onPress: () => reject(UserCancelled),
      style: 'cancel',
      text: options.cancelButtonText || DefaultCancelText,
    };
  }

  private okHandler(resolve: (value?: string) => void, options: IUserInputOptions): AlertIOSButton {
    return {
      onPress: (text?: string) => resolve(text),
      text: options.confirmButtonText || DefaultConfirmText,
    };
  }
}
