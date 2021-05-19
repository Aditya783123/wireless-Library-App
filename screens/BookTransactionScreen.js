import React from 'react';
import { Text, View, TouchableOpacity,StyleSheet } from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';

export default class TransactionScreen extends React.Component {


   constructor(){
     super();
     this.state = {
       hasCameraPermissions:null,
       scanned:'false',
       scannedData:'',
       buttonState:'normal'
     }
   }

    getCameraPermission = async()=>{
      /*status === granted -> permissionn is given
        else permissions is not given
      */
      const {status} = await Permissions.askAsync(Permissions.CAMERA);

      this.setState({
          hasCameraPermissions: status === 'granted',// if condition is true then true is assigned to gotCameraPermission otherwise false
          buttonState : 'clicked',
          scanned:false
      });
    }
   
    /*
      Ternary operator syntax 
      condition ? if True: if False

      if(score>100){
        stop the game
      }else{
        continue
      }

      score>100 ? stop the game : continue

      if(hasCameraPermissions === true){
        show scanneddata
      }else{
         request camera permissions
      }
    */

    handleBarCodeScanned = async({type,data})=>{

      console.log("HandleBarCodeScanned")
        this.setState({
            scanned:true,
            scannedData:data, 
            buttonState:'normal'
        });
    }

    render() {

      var hasCameraPermissions =  this.state.hasCameraPermissions;
      var buttonState = this.state.buttonState;
      var scanned = this.state.scanned;

      if(buttonState === 'clicked' && hasCameraPermissions){
          return(
            <BarCodeScanner
            onBarCodeScanned={scanned ?  undefined: this.handleBarCodeScanned }
            style = {StyleSheet.absoluteFillObject}
            />
          );
      }
      else if (buttonState === 'normal'){
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>
                  {hasCameraPermissions === true ? this.state.scannedData : 'Request Camera Permission' }
                </Text>
                <TouchableOpacity style={{backgroundColor:"blue",alignItems:'center'}}
                  onPress={this.getCameraPermission}>
                    <Text style={{color:'white'}}>
                        Scan QR Code
                    </Text>
                  
                </TouchableOpacity>
          </View>
        )
      }
      
    }
  }