import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import { multiply, invokeIntent, getUpiApps } from 'react-native-upi-intent';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  // const deepLink =
  //   'upi://mandate?pa=paytm-68550775@paytm&pn=Gullak&mc=5499&tid=PYTM20220812352667308803&tr=PAYTMSUBS20220812352667308803&tn=Amount%20to%20be%20paid%20now%20is%20Rs%201.00&am=100.00&mam=1.00&cu=INR&mode=00&purpose=14&orgid=000000&validitystart=12082022&validityend=31122031&amrule=MAX&recur=ASPRESENTED&mn=Subscription%20for%20Gullak';
  // const deeplink1 =
  //   'upi://pay?pa=paytm-68550775@paytm&pn=Gullak%20Money&mc=5499&tid=PYTM20220412304077016706&tr=20220412304077016706&am=10&cu=INR';

  const handlePress = async () => {
    try {
      // const array = [
      //   { packageName: 'com.phonepe.app', appScheme: 'ppe://pay' },
      //   { packageName: 'net.one97.paytm', appScheme: 'paytmmp://upi/pay' },
      //   {
      //     packageName: 'com.google.android.apps.nbu.paisa.user',
      //     appScheme: 'tez://upi/pay',
      //   },
      //   { packageName: 'null', appScheme: '' },
      // ];
      // console.log(await invokeIntent(deepLink, 'paytmmp://upi/mandate'));
      // console.log(await getUpiApps(array, 'PAY'));
      // const res = await invokeIntent(deepLink);
      // console.info(res);
    } catch (err) {
      console.error('ERROR', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Button title="Press" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
