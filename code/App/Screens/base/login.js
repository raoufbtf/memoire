import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { FIREBASE_AUTH } from '../../FireBaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '../../UserContext';
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../FireBaseConfig";
import { Alert } from 'react-native';

export default function Login({ navigation }) {
  const [pwd, setPwd] = useState('');
  const [email, setEmail] = useState('');
  const auth = FIREBASE_AUTH;
  const { setUser } = useUser();
  const [userData, setUserData] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, pwd);
      if (response) {
        const user = response.user;
        setUser(user);

        const userRef = doc(FIREBASE_DB, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }

        if (userData && userData.type == "user") {
          navigation.navigate('Home2');
        } 
        else if (userData && userData.type == "chauffeur") {
          navigation.navigate('Home3');
        }
      } else {
        console.log("Sign-in failed, but no error was thrown.");
      }
    } catch (error) {
      
      Alert.alert('Erreur de connexion', "L'email ou le mot de passe est incorrect", [
        { text: 'OK' }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagecontainer}>
        <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}>
          <Image style={{ flex: 1, resizeMode: 'contain' }} source={require("../assets/yourway.png")} />
        </View>
        <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
          <Image style={{ flex: 1, resizeMode: 'contain' }} source={require("../assets/caricature.png")} />
        </View>
      </View>
      <View style={styles.formContainer}>
        <View style={{ flex: 1, flexDirection: "column", padding: 10, alignItems: 'center', justifyContent: 'flex-start' }}>
          <Text style={styles.title}>Bienvenue chers clients</Text>
          <Text style={styles.subtitle}>Entrez vos informations pour vous connecter</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Username"
          />
          <TextInput
            style={styles.input}
            value={pwd}
            onChangeText={setPwd}
            placeholder="Password"
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Connexion</Text>
          </TouchableOpacity>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ textAlign: "center" }}>
              Si vous n'avez pas de compte{' '}
              <Text onPress={() => { navigation.navigate('Signup'); }} style={{ textDecorationLine: "underline", color: "blue" }}>inscrivez-vous</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 32, 77, 0.1)',
  },
  imagecontainer: {
    flex: 0.5,
  },
  formContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    paddingBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    paddingBottom: 20,
  },
  input: {
    width: "90%",
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    padding: 10,
  },
  button: {
    alignSelf: "center",
    backgroundColor: '#2395FF',
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: "90%",
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
