import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  Button,
  ViewStyle,
  TextStyle,
  TouchableHighlight,
} from 'react-native';
import { Actions } from '../../Presenter/connect';
import { MainPresenterInput, MainPresenterViewModel } from './MainPresenter';

type Props = Actions<MainPresenterInput> & MainPresenterViewModel;

export class MainScreen extends Component<Props> {
  keyExtractor = (item: number, index: number) => String(item + index);

  render() {
    console.log('this.props.actions: ', this.props.actions);
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Reading List</Text>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={[1, 2, 3]}
            renderItem={renderItemCell}
            keyExtractor={this.keyExtractor}
          />
        </View>

        <View style={styles.addBookContainer}>
          <Button title={'Add book'} onPress={this.props.actions.addBook}/>
        </View>
      </View>
    );
  }
}

const renderItemCell = (_info: ListRenderItemInfo<number>) => (
  <TouchableHighlight underlayColor={'#e7e7e7'} onPress={() => {}}>
    <View style={styles.itemContainer}>
      <View style={styles.bookNameContainer}>
        <Text>Book Name</Text>
      </View>
      <View style={styles.percentContainer}>
        <Text>Percent</Text>
      </View>
      <View>
        <Text>></Text>
      </View>
    </View>
  </TouchableHighlight>
);

const view = (viewStyle: ViewStyle) => viewStyle;
const text = (textStyle: TextStyle) => textStyle;

const styles = StyleSheet.create({
  container: view({
    flex: 1,
  }),

  itemContainer: view({
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 16,
  }),
  bookNameContainer: view({
    flex: 1,
  }),
  percentContainer: view({
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  }),

  titleContainer: view({
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '25%',
  }),
  title: text({
    fontSize: 36,
  }),

  listContainer: view({
    flex: 1,
  }),

  addBookContainer: view({
    flex: 0,
    height: '15%',
    justifyContent: 'center',
    alignItems: 'stretch',
  }),

  button: view({
    flex: 1,
    height: '100%',
  }),
});
