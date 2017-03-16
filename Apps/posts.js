import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  RefreshControl
} from 'react-native';

export default class Post extends Component{
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
    return fetch('https://api.tumblr.com/v2/blog/xkcn.info/posts/photo?api_key=Q6vHoaVm5L1u2ZAW1fqv3Jw48gFzYVg9P0vH0VHl3GVy6quoGV&limit=20')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          dataSource : this.state.dataSource.cloneWithRows(responseJson.response.posts)
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render(){
    return(
      <View style={{backgroundColor:'#CCC'}}>
        <StatusBar
          backgroundColor="red"
        />
        <View style={styles.container}>
           <View style={styles.header}>
             <Text style={styles.headerText}>
               Tumblr
             </Text>
           </View>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={this.renderMovieCell.bind(this)}
            renderFooter={this.renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => this._onRefresh.bind(this)}
              />
            }
            onEndReached={() => this._onEndReached()}
          />
        </View>
      </View>
    )
  }

  _onEndReached(){
    alert("Ahah, onEndReached fired !!!")
  }

  _onRefresh(){
    this.getMoviesFromApiAsync();
  }

  renderFooter(){
    return(
      <View>
        <Text>End...</Text>
      </View>
    )
  }


  renderMovieCell(rowData){
    rowData.tagsv2 = '';
    for (var i = 0; i < rowData.tags.length; i++) {
      rowData.tagsv2 += "#" + rowData.tags[i] + " "
    }
    return(
      <View style={{backgroundColor:'#FFF', marginBottom:5}}>
        <View style={{backgroundColor: 'transparent'}}>
          <View>
            {/* Image */}
            <View style={{flexDirection:'row'}}>
              <Image
                 style={{height: 300, flex:1, resizeMode: 'cover',}}
                 source={{uri: rowData.photos[0].original_size.url}}
               >
               </Image>
            </View>
            {/* End Image */}
            {/* Content */}
            <View style={{padding:10}}>
              {/* Title */}
              <View>
                <Text>
                  {rowData.summary}
                </Text>
              </View>
              {/* End title */}
              <View style={styles.hr}>
                <View style={{width: 200, height: 2, backgroundColor: '#000', margin:10}}></View>
              </View>
              {/* Tags */}
              <View>
                <Text>
                  {rowData.tagsv2}
                </Text>
              </View>
              {/* End Tags */}
            </View>
          </View>
            {/* Content */}
            {/* Time */}
            <View>
              <Text style={{textAlign: 'right', marginRight:10}}>
                {this.timeDifference(rowData.timestamp)}
              </Text>
            </View>
            {/* Time */}
            <View style={{backgroundColor:'#000', height:2, marginTop:10}}></View>
        </View>
      </View>
    )
  }

  timeDifference(previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = Math.floor(Date.now() / 1000) - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';
    }

    else {
        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';
    }
}
}




var styles = StyleSheet.create({
  container: {
    marginTop:5
  },
  hr: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop:10,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CCC',
  },
  headerText: {
    textAlign: 'center',
    margin: 10,
    color:'#fff',
    fontWeight: 'bold',
    fontSize:20
  },
})
