import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-upi-intent' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const UpiIntent = NativeModules.UpiIntent
  ? NativeModules.UpiIntent
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return UpiIntent.multiply(a, b);
}

const MANDATE_SCHEME = 'upi://mandate';
const DEFAULT_SCHEME = 'upi://pay';
type AppItem = {
  packageName: string;
};

export async function getUpiApps(
  type?: 'PAY' | 'MANDATE'
): Promise<Array<AppItem>> {
  if (Platform.OS === 'android')
    return UpiIntent.getUpiApps(
      type === 'MANDATE' ? MANDATE_SCHEME : DEFAULT_SCHEME
    );
  return [];
}

export async function invokeIntent(
  deeplink: string,
  packageName?: string
): Promise<boolean> {
  if (Platform.OS === 'android')
    return packageName
      ? UpiIntent.invokeIntent(deeplink, packageName)
      : UpiIntent.invokeIntent(deeplink, 'null');
  return true;
}
