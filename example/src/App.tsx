import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import { multiply, invokeIntent } from 'react-native-upi-intent';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  const deepLink =
    'upi://mandate?pa=paytm-68550775@paytm&pn=Gullak&mc=5499&tid=PYTM20220812352667308803&tr=PAYTMSUBS20220812352667308803&tn=Amount%20to%20be%20paid%20now%20is%20Rs%201.00&am=100.00&mam=1.00&cu=INR&mode=00&purpose=14&orgid=000000&validitystart=12082022&validityend=31122031&amrule=MAX&recur=ASPRESENTED&mn=Subscription%20for%20Gullak';

  const handlePress = async () => {
    try {
      const res = await invokeIntent(deepLink, 'com.phonepe.app');
      console.info(res);
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
