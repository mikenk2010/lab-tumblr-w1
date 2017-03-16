import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';

export class Bao extends Component{
  render(){
    return(
      <View><Text>Hahaha Bao</Text></View>
    )
  }
}

export default class Movie extends Component{
  constructor() {
     super();
     const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     this.state = {
       dataSource: ds.cloneWithRows([]),
       searchText: ''
     };
  }

  componentDidMount(){
    this.getMoviesFromApiAsync();
  }

  getMoviesFromApiAsync() {
    return fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=a07e22bc18f5cb106bfe4cc1f83ad8ed')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          dataSource : this.state.dataSource.cloneWithRows(responseJson.results)
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render(){
    return(
      <View style={styles.container}>
        <ListView
          style={{marginTop:15}}
          renderHeader={this.renderHeader.bind(this)}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this.renderMovieCell.bind(this)}
        />
      </View>
    )
  }

  renderHeader(){
    return(
      <View>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(searchText) => this.searchMovie(searchText)}
          value={this.state.searchText}
        />
      </View>
    )
  }

  searchMovie(text){
    this.setState({
      searchText : text,
    })

    var rows = [];
    for (var i=0; i < this.state.dataSource._dataBlob.s1.length; i++) {
      var title = this.state.dataSource._dataBlob.s1[i].title.toLowerCase();
      var desc = this.state.dataSource._dataBlob.s1[i].overview.toLowerCase();
      if(title.search(text.toLowerCase()) !== -1 || desc.search(text.toLowerCase()) !== -1){
        rows.push(this.state.dataSource._dataBlob.s1[i]);
      }
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rows)
    });
  }

  renderMovieCell(rowData){
    return(
      <View style={{backgroundColor:'orange'}}>
        <View style={{flexDirection:'row',}}>

          <View style={{margin: 10, flex: 0.3}}>
            <Image
               style={{height: 150}}
               source={{uri: 'https://image.tmdb.org/t/p/w342/' + rowData.poster_path}}
             />
          </View>

          <View style={{flex: 0.7}}>
            <Text>
              {rowData.title}
            </Text>
            <Text numberOfLines={3}>{rowData.overview}</Text>
          </View>

        </View>
      </View>
    )
  }
}




var styles = StyleSheet.create({
  container: {
    marginTop:5
  },
  header:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
})
