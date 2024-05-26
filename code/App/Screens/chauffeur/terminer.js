import React,{useState} from 'react';
import { StyleSheet, View, Text ,TextInput} from 'react-native';
import ButtonM from '../../Components/button';
function Terminer({navigation}) {
    const [code,setcode]=useState("");
   

    return (
       <View style={styles.container}>     
        <View style={styles.screen}>
         <Text style={styles.title } > Vous venez à la porte du client  ?</Text>
         <Text style={styles.text }> Demander le code de confirmation au Client . </Text>
         <View style={{flex:0.7,width:"100%",alignItems:"center", justifyContent:"center",}}>
         <TextInput
                  style={styles.input}
                  onChangeText={setcode}
                  value={code}
                  placeholder="Enter le code  du client "
                />
         </View>
         <ButtonM style={styles.button}fnc={() => navigation.goBack()}  >Terminer</ButtonM>
         <ButtonM fnc={() => navigation.goBack()}  >Retourner</ButtonM>
     
     
        </View>
        </View>
  
    );
  }
  const styles = StyleSheet.create({
    container:{
      backgroundColor: 'rgba(239, 32, 77, 0.1)',
       flex: 1,alignItems:"center", 
       justifyContent:"center",
      },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    width:"95%",
    alignItems:"center",
    alignSelf:"center",
    justifyContent:"flex-start",
    margin:20,
    borderRadius:25,
    paddingTop:10,
    
  },
  title:{
    
      fontSize:25,
      fontWeight:"700",
      textAlign:"center", 
      paddingTop:10
  },
  text:{
      fontSize:18,
      fontWeight:"500",
      textAlign:"center",
      paddingTop:10
  
  },
  textedit:{width:"90%",height:"30%"},
  input: {
    justifyContent: "center",
    alignSelf: "center",
    width: '90%',
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    padding: 10,
},
button:{
    marginBottom:30,
    backgroundColor:"#B89F92",
}
  });
  export default Terminer ;