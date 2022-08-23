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

type PackageNameEnum =
  | 'com.phonepe.app'
  | 'net.one97.paytm'
  | 'com.google.android.apps.nbu.paisa.user'
  | 'in.org.npci.upiapp';

const packageNameList = [
  'com.phonepe.app',
  'net.one97.paytm',
  'com.google.android.apps.nbu.paisa.user',
  'in.org.npci.upiapp',
];

const linkPayPrefixMap = {
  'com.phonepe.app': 'phonepe://pay?',
  'net.one97.paytm': 'paytmmp://upi/pay?',
  'com.google.android.apps.nbu.paisa.user': 'tez://upi/pay?',
  'in.org.npci.upiapp': 'bhim://upi?',
};

const linkMandatePrefixMap = {
  'com.phonepe.app': 'phonepe://mandate?',
  'net.one97.paytm': 'paytmmp://upi/mandate?',
  'com.google.android.apps.nbu.paisa.user': 'tez://upi/mandate?',
  'in.org.npci.upiapp': 'bhim://upi?',
};

const linkPayMap = {
  'com.phonepe.app':
    'phonepe://pay?pa=paytm-68550775@paytm&pn=Gullak%20Money&mc=5499&tid=PYTM20220412304077016706&tr=20220412304077016706&am=10&cu=INR',
  'net.one97.paytm':
    'paytmmp://upi/pay?pa=paytm-68550775@paytm&pn=Gullak%20Money&mc=5499&tid=PYTM20220412304077016706&tr=20220412304077016706&am=10&cu=INR',
  'com.google.android.apps.nbu.paisa.user':
    'tez://upi/pay?pa=paytm-68550775@paytm&pn=Gullak%20Money&mc=5499&tid=PYTM20220412304077016706&tr=20220412304077016706&am=10&cu=INR',
  'in.org.npci.upiapp':
    'bhim://upi?pa=paytm-68550775@paytm&pn=Gullak%20Money&mc=5499&tid=PYTM20220412304077016706&tr=20220412304077016706&am=10&cu=INR',
};

const linkMandateApp = {
  'com.phonepe.app':
    'phonepe://mandate?pa=paytm-68550775@paytm&pn=Gullak&mc=5499&tid=PYTM20220812352667308803&tr=PAYTMSUBS20220812352667308803&tn=Amount%20to%20be%20paid%20now%20is%20Rs%201.00&am=100.00&mam=1.00&cu=INR&mode=00&purpose=14&orgid=000000&validitystart=12082022&validityend=31122031&amrule=MAX&recur=ASPRESENTED&mn=Subscription%20for%20Gullak',
  'net.one97.paytm':
    'paytmmp://upi/mandate?pa=paytm-68550775@paytm&pn=Gullak&mc=5499&tid=PYTM20220812352667308803&tr=PAYTMSUBS20220812352667308803&tn=Amount%20to%20be%20paid%20now%20is%20Rs%201.00&am=100.00&mam=1.00&cu=INR&mode=00&purpose=14&orgid=000000&validitystart=12082022&validityend=31122031&amrule=MAX&recur=ASPRESENTED&mn=Subscription%20for%20Gullak',
  'com.google.android.apps.nbu.paisa.user':
    'tez://upi/mandate?pa=paytm-68550775@paytm&pn=Gullak&mc=5499&tid=PYTM20220812352667308803&tr=PAYTMSUBS20220812352667308803&tn=Amount%20to%20be%20paid%20now%20is%20Rs%201.00&am=100.00&mam=1.00&cu=INR&mode=00&purpose=14&orgid=000000&validitystart=12082022&validityend=31122031&amrule=MAX&recur=ASPRESENTED&mn=Subscription%20for%20Gullak',
  'in.org.npci.upiapp':
    'bhim://upi?pa=paytm-68550775@paytm&pn=Gullak&mc=5499&tid=PYTM20220812352667308803&tr=PAYTMSUBS20220812352667308803&tn=Amount%20to%20be%20paid%20now%20is%20Rs%201.00&am=100.00&mam=1.00&cu=INR&mode=00&purpose=14&orgid=000000&validitystart=12082022&validityend=31122031&amrule=MAX&recur=ASPRESENTED&mn=Subscription%20for%20Gullak',
};

export async function getUpiApps(
  type?: 'PAY' | 'MANDATE'
): Promise<Array<AppItem>> {
  if (Platform.OS === 'android')
    return UpiIntent.getUpiApps(
      type === 'MANDATE' ? MANDATE_SCHEME : DEFAULT_SCHEME
    );
  const resultList = [];
  for (const [key, value] of Object.entries(
    type === 'MANDATE' ? linkMandateApp : linkPayMap
  )) {
    try {
      if (await UpiIntent.canOpenUpi(value))
        resultList.push({ packageName: key });
    } catch (err) {}
  }
  return resultList;
}

export async function invokeIntent(
  deeplink: string,
  packageName?: string
): Promise<boolean> {
  if (Platform.OS === 'android')
    return packageName
      ? UpiIntent.invokeIntent(deeplink, packageName)
      : UpiIntent.invokeIntent(deeplink, 'null');

  if (!packageName || !packageNameList.includes(packageName)) return false;
  deeplink = deeplink.startsWith('upi://mandate?')
    ? linkMandatePrefixMap[packageName as PackageNameEnum] +
      deeplink.replace('upi://mandate?', '')
    : linkPayPrefixMap[packageName as PackageNameEnum] +
      deeplink.replace('upi://pay?', '');
  return await UpiIntent.openUpiApp(deeplink);
}
