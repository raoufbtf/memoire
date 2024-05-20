
import React ,{ useState } from 'react';
import {View } from 'react-native';
import Container from '../../Components/container';
import Textinput from '../../Components/textinput';
import ButtonM from '../../Components/button';



export default function Emailconfig({navigation}) {
    const [codenum , setcodenum] = useState('');
    const suivant = () => {
      console.log('====================================');
      console.log("suivant ");
      console.log('====================================');
      
      navigation.navigate('Mdpconfig')
    };


  return (
    <Container title={"voullier vous confirmer votre  numero de telephone ?"} text={"vous receverais  un Sms  avec un code  entre ses code !"}>
        
        <View style={{marginBottom:70,marginTop:160}}>
         <Textinput id={codenum} holder={"Entre le code de confirmation de numero de telephone"} secure={false} fnc={setcodenum} label={"Code de confirmation de numero de telephone"}/>
      </View>
      <ButtonM fnc={suivant} >Suivant</ButtonM>
    
    </Container>
  
)
}


