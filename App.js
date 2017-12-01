'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
const firebase = require('firebase');
const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./styles.js')
import prompt from 'react-native-prompt-android';

console.ignoredYellowBox = ['Setting a timer'];

const {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Alert,
} = ReactNative;

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA2kMWKKF-QSOB0oTxyeb7zoHgo6ZUVyik",
  authDomain: "groceryapp-f69fc.firebaseapp.com",
  databaseURL: "https://groceryapp-f69fc.firebaseio.com",
  projectId: "groceryapp-f69fc",
  storageBucket: "groceryapp-f69fc.appspot.com",
  messagingSenderId: "592881313811",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);



export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.itemsRef = this.getRef().child('items');
    this.variablesRef = this.getRef().child('variables');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }


  render() {
    let ver = true;
    if(ver) {
      return (
        <View style={styles.container}>

          <StatusBar title="Grocery List" />

          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderItem.bind(this)}
            enableEmptySections={true}
            style={styles.listview}/>

          <ActionButton onPress={this._addItem.bind(this)} title="Add" />

        </View>
      )
    } else {
      return(
        <View>
          <Text>nada</Text>
        </View>
      )
    }
  }

  _addItem() {
    prompt(
      'Add New Item',
      null,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {
          text: 'Add',
          onPress: (text) => {
            this.itemsRef.push({ title: text })
          }
        },
      ],
      'plain-text'
    );
  }



  _renderItem(item) {

    const onPress = () => {
      Alert.alert(
        'Complete',
        null,
        [
          {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }

}
