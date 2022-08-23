import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import { multiply, getUpiApps } from 'react-native-upi-intent';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  const handlePress = async () => {
    try {
      const res = await getUpiApps('MANDATE');
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
