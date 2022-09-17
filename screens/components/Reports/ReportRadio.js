import * as React from 'react';
import { View } from 'react-native';
import { RadioButton, Text } from 'react-native-paper';

const MyComponent = () => {
  const [value, setValue] = React.useState('first');

  return (
    <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value} style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}>
      <View  >
        <Text>Scale</Text>
        <RadioButton value="first" />
      </View>
      <View >
        <Text>Keyword</Text>
        <RadioButton value="second" />
      </View>
   </RadioButton.Group>
  );
};

export default MyComponent;