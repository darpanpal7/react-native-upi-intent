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

const mandateLink =
  'upi://mandate?pa=paytm-68550775@paytm&pn=Gullak&mc=5499&tid=PYTM20220519323795870130&tr=PAYTMSUBS20220519323795870130&tn=Amount%20to%20be%20paid%20now%20is%20Rs%2015.00&am=15.00&mam=15.00&cu=INR&mode=00&purpose=14&orgid=000000&validitystart=19052022&validityend=06052023&amrule=MAX&recur=ASPRESENTED&mn=Subscription%20for%20Gullak';
const payLink =
  'upi://pay?pa=paytm-68550775@paytm&pn=Gullak%20Money&mc=5499&tid=PYTM20220412304077016706&tr=20220412304077016706&am=10&cu=INR';

export async function getUpiApps(
  apps: Array<{ packageName: string; appScheme: string }>,
  type?: 'PAY' | 'MANDATE'
): Promise<Array<{ packageName: string }>> {
  if (Platform.OS === 'android') {
    const appsAvailable = await UpiIntent.getUpiApps(
      type === 'MANDATE' ? MANDATE_SCHEME : DEFAULT_SCHEME
    );
    const resultList = [];
    for (const { packageName } of apps) {
      if (
        appsAvailable.some(
          (e: { packageName: string }) => e.packageName === packageName
        )
      )
        resultList.push({ packageName });
    }

    return resultList;
  }
  const resultList = [];
  for (const { packageName, appScheme } of apps) {
    try {
      const testDeeplink = type === 'MANDATE' ? mandateLink : payLink;
      const specificDeeplink = createDeeplink(testDeeplink, appScheme);
      if (await UpiIntent.canOpenUpi(specificDeeplink))
        resultList.push({ packageName });
    } catch (err) {}
  }
  return resultList;
}

export async function invokeIntent(
  deeplink: string,
  name?: string
): Promise<boolean> {
  if (Platform.OS === 'android')
    return name
      ? UpiIntent.invokeIntent(deeplink, name)
      : UpiIntent.invokeIntent(deeplink, 'null');

  if (!name) return false;
  deeplink = createDeeplink(deeplink, name);
  if (!deeplink) return false;
  // console.log(await UpiIntent.canOpenUpi(deeplink));
  return await UpiIntent.openUpiApp(deeplink);
}

function createDeeplink(deeplink: string, name: string) {
  if (Platform.OS === 'android') return deeplink;
  const scheme = deeplink.startsWith(MANDATE_SCHEME)
    ? MANDATE_SCHEME
    : deeplink.startsWith(DEFAULT_SCHEME)
    ? DEFAULT_SCHEME
    : null;
  if (!scheme) return '';
  deeplink = deeplink.replace(scheme, name);
  return deeplink;
}
