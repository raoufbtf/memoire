import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import { useUser } from '../../UserContext';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FireBaseConfig";
import Container from '../../Components/container';
import ButtonM from '../../Components/button';

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [type, setType] = useState("user");
  const { setUser } = useUser();

  const auth = FIREBASE_AUTH;

  const handleSignUp = async () => {
    if (password !== confirmpassword) {
      Alert.alert('Erreur de mot de passe', 'Les mots de passe ne correspondent pas', [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ]);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const userRef = doc(FIREBASE_DB, "users", userCredential.user.uid);
      await setDoc(userRef, {
        name: name,
        familyName: familyName,
        email: email,
        num: number,
        type: type
      });

      setUser(userCredential.user);
      navigation.navigate('Home2');
    } catch (error) {
      console.error("Sign up error:", error.message);
      Alert.alert('Erreur d\'inscription', error.message, [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ]);
    }
  };

  return (
    <Container title="Vous voulez profiter de YourWay ?" text="Pour profiter des services de YourWay, remplissez vos informations.">
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom:</Text>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Prénom:</Text>
        <TextInput placeholder="Family Name" value={familyName} onChangeText={setFamilyName} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Numéro de téléphone:</Text>
        <PhoneInput 
          initialCountry="dz"
          value={number}
          onChangePhoneNumber={setNumber}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe:</Text>
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirmation de mot de passe:</Text>
        <TextInput placeholder="Password" value={confirmpassword} onChangeText={setConfirmpassword} secureTextEntry style={styles.input} />
      </View>
      <ButtonM fnc={handleSignUp}>SignUp</ButtonM>
    </Container>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '90%',
    marginTop: 5,
    alignSelf: 'center',
  },
  label: {
    fontWeight: '500',
    fontSize: 17,
    marginLeft: 20,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    padding: 10,
    alignSelf: 'center',
  },
});

export default SignUp;
