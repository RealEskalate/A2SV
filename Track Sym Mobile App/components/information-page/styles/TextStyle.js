import { StyleSheet } from 'react-native'

const TextStyle = StyleSheet.create({
    textStyle:{
        flex: 2, 
        marginTop: 15,
        fontFamily:'sans-serif',
        fontSize:16,
        //margin:5
    },
    headerTextStyle:{
        margin:5,
        fontSize:20,
        fontFamily:'serif',
        textAlign:'justify'
      },
      detailTextStyle:{
        paddingLeft:30,
        margin: 10,
        fontSize:18,
        fontFamily:'serif',
        textAlign:'justify' 
      }

});

export default TextStyle;