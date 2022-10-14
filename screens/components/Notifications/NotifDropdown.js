import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from 'react'; 


function DropSearch() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'DATA', value: 'DATA'},
    
  ]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder="Search"
      containerStyle={{width: 340, alignItems: 'center', justifyContent:'center', }}
        style=
        {{
            // backgroundColor: '#fafafa',
            borderLeftColor: 'green',
            borderColor: 'green',
            borderLeftWidth: 5, 
            flexDirection: 'row',
            alignContent: 'center',
            width: 340,
            justifyContent: 'center',
            maxWidth: 380,
            margin: 10,
            marginLeft: 40,
            borderRadius: 5,
            // height: 30,
            color: 'green',
            
    }}
    />
  );
}

export default DropSearch;