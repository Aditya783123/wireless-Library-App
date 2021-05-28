import React from 'react';
import { Text, View, TouchableOpacity,StyleSheet,TextInput,Image,ToastAndroid } from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import db from '../config';
import firebase from 'firebase';

export default class TransactionScreen extends React.Component {


   constructor(){
     super();
     this.state = {
       hasCameraPermissions:null,
       scanned:false,
       scannedData:'',
       buttonState:'normal',
       scannedBookId:'',
       scannedStudentId:'',
       transactionMessage:''
     }
   }

   handleTransaction = async ()=>{
       var transactionType = await this.checkBookEligibility();
       if(!transactionType){
         alert("This Book Id doesnt exist in database");
         this.setState({
           scannedBookId:'',
           scannedStudentId:''
         });
       }else if(transactionType === "issue"){
          var isStudentEligible = await this.checkStudentEligibiltyForBookIssue();
          if(isStudentEligible){
            this.initiateBookIssue();
            alert("BOOK ISSUED");
          }
       }else{
         var isStudentEligible = await this.checkStudentEligibiltyForBookReturn();
         if(isStudentEligible){
           this.initiateBookReturn();
           alert("BOOK RETURNED");
         }
       }
   }

   initiateBookIssue = async()=>{
     
     db.collection("transaction").add({
       'studentId': this.state.scannedStudentId,
       'bookId': this.state.scannedBookId,
       'date': firebase.firestore.Timestamp.now().toDate(),
       'transactionType': 'Issue'
     });

     db.collection("books").doc(this.state.scannedBookId).update({
       'bookAvailability': false
     });

     db.collection("students").doc(this.state.scannedStudentId).update({
       'numberOfBooks': firebase.firestore.FieldValue.increment(1)
     });

     this.setState({
       scannedBookId:'',
       scannedStudentId:''
     });
      
   }

   initiateBookReturn = async()=>{
     db.collection("transaction").add({
       'studentId':this.state.scannedStudentId,
       'bookId':this.state.scannedBookId,
       'date':firebase.firestore.Timestamp.now().toDate(),
       'transactionType':'Return'
     });

     db.collection("books").doc(this.state.scannedBookId).update({
      'bookAvailability':true
    });

    db.collection("students").doc(this.state.scannedStudentId).update({
      'numberOfBooks':firebase.firestore.FieldValue.increment(-1)
    });
    

    this.setState({
      scannedBookId:'',
      scannedStudentId:''
    })
   }

   checkStudentEligibiltyForBookIssue = async()=>{
      // select studentId from students where studentId = Id in input Box (This.state.scannedStudentId)
      //select studentId from students where studentId = This.state.scannedStudentId

      const studentRef = await db.collection("students").where("studentId","==",this.state.scannedStudentId).get();
    
      var isStudentEligible = '';
      if(studentRef.docs.length === 0){
        isStudentEligible =  false;
        this.setState({
          scannedBookId:'',
          scannedStudentId:''
        });
        alert("Student Id doesn't exist in database");
      }else{
        studentRef.docs.map((doc)=>{
          var student = doc.data();
          if(student.numberOfBooks < 2){
            isStudentEligible = true;
          }else{
            isStudentEligible = false;
            this.setState({
              scannedBookId:'',
              scannedStudentId:''
            });
            alert("Student already has 2 books issued");
          }
        });
      }
      return isStudentEligible;
   }

     checkStudentEligibiltyForBookReturn = async()=>{
       var transactionRef = await db.collection("transaction").where("bookId","==", this.state.scannedBookId).limit(1).get();
       var isStudentEligible='';
       transactionRef.docs.map((doc)=>{
         var lastBookTransaction=doc.data();
         if(lastBookTransaction.studentId ===this.state.scannedStudentId){
            isStudentEligible = true;
         }
         else{
           isStudentEligible=false;
           alert("This book was not issued to this student!");
           this.setState({
             scannedBookId:'',
             scannedStudentId:''
           })
         }
       });
       alert("isStudentEligible: "+isStudentEligible);
       return isStudentEligible;
     }

     checkBookEligibility = async()=>{
       // select bookId from books where bookId = this.state.scannedBookId
       var bookRef=await db.collection("books").where("bookID", "==", this.state.scannedBookId).get();
      
       var transactionType='';
       if(bookRef.docs.length === 0){
          transactionType= false;
       }else{
          bookRef.docs.map((doc)=>{
            var book = doc.data();
            if(book.bookAvailability){
              transactionType="issue";
            }
            else{
              transactionType="return";
            }
          });
       }
       alert("transactionType: "+transactionType)
       return transactionType;
     }
   
    getCameraPermission = async(id)=>{
      /*status === granted -> permissionn is given
        else permissions is not given
      */
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
          hasCameraPermissions: status === 'granted',// if condition is true then true is assigned to gotCameraPermission otherwise false
          scanned:false,
          buttonState: id
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
     
      const {buttonState} = this.state;
      if(buttonState === "BookId"){
          this.setState({
            scanned:true,
            scannedBookId:data, 
            buttonState:'normal'
        });
      }else if(buttonState === "StudentId"){
        this.setState({
          scanned:true,
          scannedStudentId:data, 
          buttonState:'normal'
      });
      }
     // console.log("HandleBarCodeScanned")
        
    }

    render() {

      var hasCameraPermissions =  this.state.hasCameraPermissions;
      var buttonState = this.state.buttonState;
      var scanned = this.state.scanned;

      if(buttonState !== 'normal' && hasCameraPermissions){
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

                <View style={styles.inputView}>
                  <TextInput 
                      placeholder="Book ID" 
                      style={styles.inputBox} 
                      value={this.state.scannedBookId}
                      onChangeText={(text)=>this.setState({scannedBookId: text})}
                  />
                  <TouchableOpacity style={styles.scanButton} onPress={()=>{
                    this.getCameraPermission("BookId")
                  }}>
                    <Text style={styles.buttonText}>
                      Scan
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputView}>
                  <TextInput 
                      placeholder="Student ID" 
                      style={styles.inputBox} 
                      value={this.state.scannedStudentId}
                      onChangeText={(text)=>this.setState({scannedStudentId:text})}
                  />
                  <TouchableOpacity style={styles.scanButton} onPress={()=>{
                    this.getCameraPermission("StudentId")
                  }}>
                      <Text style={styles.buttonText}>
                        Scan
                      </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style = {styles.submitButton} onPress={()=>{this.handleTransaction()}}>
                  <Text>Submit</Text>
                </TouchableOpacity>
                
          </View>
        )
      }
      
    }
  }

  const styles = StyleSheet.create({
    scanButton:{
      backgroundColor:'green',
      padding:10,
      borderWidth:1.5
    },
    inputView:{
      flexDirection:'row',
      margin:20
    },
    inputBox:{ 
      width:200,
      height:40,
      borderWidth:1.5,
      borderRightWidth:0,
      fontSize:20
    },
    buttonText:{
      fontSize:15,
      textAlign:'center',
      
    },
    submitButton:{
      width:200,
      height:40,
      padding:10,
      backgroundColor:'green',
      alignItems:'center',
      alignSelf:'center',
      justifyContent:'center'
    }
  })