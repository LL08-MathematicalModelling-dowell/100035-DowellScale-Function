import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from 'react'; 


function DropSearch() {
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
      placeholder="Search"
      containerStyle={{width: 340, marginLeft: 10, alignItems: 'center',}}
        style=
        {{
            backgroundColor: '#fafafa',
            borderLeftColor: 'green',
            borderColor: 'white',
           

            borderLeftWidth: 5, 
            flexDirection: 'row',
            alignContent: 'center',
            width: 340,
            maxWidth: 400,
            margin: 10,
            borderRadius: 5,
            // height: 30,
            color: 'green',
            
    }}
    />
  );
}

export default DropSearch;