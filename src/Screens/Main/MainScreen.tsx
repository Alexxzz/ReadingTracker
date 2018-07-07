import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  FlatList,
  ViewStyle,
  TextStyle,
  StyleSheet,
  ListRenderItemInfo,
  TouchableHighlight,
} from 'react-native';
import { IActions } from '../../Presenter/connect';
import { IMainPresenterViewModel } from './IMainPresenterViewModel';
import { IMainPresenterInput } from './IMainPresenterInput';
import { IBookViewModel } from './IBookViewModel';
import { NavigationProps } from 'react-native-navigation';

type Props = NavigationProps & IActions<IMainPresenterInput> & IMainPresenterViewModel;

export class MainScreen extends Component<Props> {
  public async componentWillMount() {
    await this.props.actions.start();
  }

  public render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Reading List</Text>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={this.props.books}
            renderItem={this.renderItemCell}
            keyExtractor={this.keyExtractor}
          />
        </View>

        <View style={styles.addBookContainer}>
          <Button title={'Add book'} onPress={this.addBook}/>
        </View>
      </View>
    );
  }

  private keyExtractor = (item: number, index: number) => String(item + index);

  private renderItemCell = (info: ListRenderItemInfo<IBookViewModel>) => (
    <TouchableHighlight
      underlayColor={'#e7e7e7'}
      onPress={() => this.props.actions.selectBookAtIndex(info.index, this.props.componentId)}
    >
      <View style={styles.itemContainer}>
        <View style={styles.bookNameContainer}>
          <Text>{info.item.name}</Text>
        </View>
        <View style={styles.percentContainer}>
          <Text>{info.item.progress}</Text>
        </View>
        <View>
          <Text>></Text>
        </View>
      </View>
    </TouchableHighlight>
  )

  private addBook = async () => await this.props.actions.addBook();
}

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
