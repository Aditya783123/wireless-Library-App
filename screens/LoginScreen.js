import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import firebase from 'firebase';

export default class LoginScreen extends React.Component{
   constructor(){
       super();
       this.state={
           emailId:'',
           password:''
       }
   }

   login=async(email, password)=>{
    if(email && password){
        try{
          const response = await firebase.auth().signInWithEmailAndPassword(email, password);
          if(response){
            this.props.navigation.navigate('Transaction');
          }
        }
        catch(error){
           switch(error.code){
               case 'auth/user-not-found':
                   alert("USER NOT FOUND. TRY AGAIN.");
                   break; 
               case 'auth/invalid-email':
                   alert("INCORRECT EMAIL, TRY AGAIN");
                   break;
               case 'auth/wrong-password':
                   alert("INCORRECT PASSWORD");
                   break;
           }
        }
    }
    else{
        alert("ENTER EMAIL AND PASSWORD")
    }
   }
    render(){
        return(
            <KeyboardAvoidingView style={{alignItems: 'center', marginTop: 100}}>
            <View>
                    <Image 
                    source={require('../assets/icon.png')}
                    style={{width:200, height:200 }}
                    />
                    
            </View>
            
            <TextInput 
            style = {styles.loginBox}
             placeholder="ABC@example.com"
             keyboardType="email-address"
             onChangeText={(text)=>{
               this.setState({
                   emailId:text
               })
             }}
            />

            <TextInput 
             style = {styles.loginBox}
             placeholder="Enter Your Password"
             secureTextEntry={true}
             onChangeText={(text)=>{
               this.setState({
                   password:text
               })
             }}
            />

            <TouchableOpacity style={{width:90, height:30, borderWidth:1, marginTop:20, paddingTop:5, borderRadius:7 , backgroundColor:'green'}}
            onPress={()=>{
                this.login(this.state.emailId, this.state.password)
            }}
            >
                <Text style = {{textAlign:'center'}}> LOGIN </Text>

            </TouchableOpacity>
            </KeyboardAvoidingView>
        )
    }
}

const styles =  StyleSheet.create({
    loginBox:{
        width:300,
        height:40,
        borderWidth:1.5,
        fontSize: 20,
        margin: 10,
        padding: 10
    }
})
