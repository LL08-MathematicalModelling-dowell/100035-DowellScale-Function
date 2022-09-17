import React from 'react';
import {Text} from 'react-native'

const CustomText = ( h1, h2, h3, h4, h5,  p, bold, 
                       italic, title,style, ...rest) => {
    return (
        <Text style={[
            h1 && { fontSize: 48 },
            h2 && { fontSize: 32 },
            h3 && { fontSize: 20 },
            h4 && { fontSize: 18 },
            h5 && { fontSize: 16 },
            p && { fontSize: 12 },
            bold && { fontWeight: 'bold' },
            italic && { fontStyle: 'italic'},
        style
                   ]}{...rest}>{title}</Text>
       
    );
}


export default CustomText;