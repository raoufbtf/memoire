
import React ,{ useState } from 'react';
import {View } from 'react-native';
import Container from '../../Components/container';
import Textinput from '../../Components/textinput';
import ButtonM from '../../Components/button';



export default function Mdpconfig({navigation}) {
    const [mdp , setmdp] = useState('');
    const suivant = () => {
      console.log('====================================');
      console.log("suivant ");
      console.log('====================================');
      
      navigation.navigate('Home2')
    };


  return (
    <Container title={"voullier vous saisir un mot de passe  ?"} text={"Un mot de passe doit contenir au minimum 8 caractères, à savoir au moins une lettre minuscule et une lettre majuscule, un caractère spécial et un chiffre!"}>
        
        <View style={{marginBottom:70,marginTop:50,width:"100%",justifyContent:"center",alignItems:"center"}}>
         <Textinput id={mdp} holder={"entre un  mot de passe "} secure={true} fnc={setmdp} label={"Mot de passe"}/>
         <Textinput id={mdp} holder={"entre le meme  mot de passe "} secure={true} fnc={setmdp} label={" Confirmation mot de passe "}/>
      </View>
      <ButtonM fnc={suivant} >Suivant</ButtonM>
    
    </Container>
  
)
}


