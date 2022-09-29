import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from 'react'; 
import ScaleHeader from './ScaleHeader';

function DropScale({ navigation }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'NPS', value: 'NPS'},
    {label: 'Rank', value: 'Rank'},
    {label: 'Ratio', value: 'Ratio'},
    {label: 'Likert', value: 'Likert'},
  ]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder="Drop down (Scales)"
      onPress={() => navigation.navigate('NPSScale')}
      containerStyle={{width: 340, marginLeft: 10, alignItems: 'center',}}
        style=
        {{
            backgroundColor: '#fafafa',
            borderLeftColor: 'green',
            borderLeftWidth: 5,
            borderRadius: 5,
            borderColor: 'transparent', 
            flexDirection: 'row',
            alignContent: 'center',
            width: 340,
            maxWidth: 400,
            margin: 10,
            // height: 30,
            color: 'green',
            
    }}
    />
  );
}

export default DropScale;