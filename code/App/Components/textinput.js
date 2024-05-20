import React from 'react';
import { TextInput,Text, StyleSheet, View } from 'react-native';

export default function Textinput({ id, fnc, holder, secure,label }) {
  return (
  <View style= {{ width:'90%',marginTop:15}}>
    <Text style={{fontWeight:"500",fontSize:17,marginLeft:20}}>{label}</Text>
    <TextInput
      style={styles.input}
      value={id}
      onChangeText={fnc}
      placeholder={id ? '' : holder} 
      secureTextEntry={secure}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    justifyContent:"center",
    alignSelf:"center",
    width: '90%',
    height: 40,
    backgroundColor:'rgba(255,255,255,0.5)',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    padding: 10,
  },
});
