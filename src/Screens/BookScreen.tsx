import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import {
  BookPresenter,
  BookPresenterInput,
  BookPresenterViewModel,
} from './BookPresenter';
import { Actions, connect } from '../Presenter/connect';

export class BookScreen extends Component<Actions<BookPresenterInput> & BookPresenterViewModel> {

  keyExtractor = (item: any) => String(item);

  render() {
    console.log('BookScreen render, props: ', this.props);
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            style={styles.list}
            data={this.props.progress}
            renderItem={ListItem}
            keyExtractor={this.keyExtractor}
          />
        </View>
        <View style={styles.footerContainer}>
          <Button title={'Add'} onPress={() => this.props.actions.addProgress(Date.now())}/>
          <View>
            <ResultText title={'Pages read:'} value={'x(y%)'} />
            <ResultText title={'Pages left:'} value={'z(zz%)'} />
          </View>
        </View>
      </View>
    );
  }
}

const ListItem = (item: ListRenderItemInfo<any>) => (
  <View style={styles.listItem} key={item.index}>
    <Text>{`Text – ${item.item}`}</Text>
  </View>
);

type ResultProps = {
  title: string;
  value: string;
};
const ResultText = (props: ResultProps) => (
  <View style={styles.resultContainer}>
    <Text>{props.title}</Text>
    <Text style={styles.resultValueText}>{props.value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  list: {
    flex: 1,
  },
  listItem: {
    marginHorizontal: 16,
  },
  footerContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    alignSelf: 'stretch',
  },
  resultContainer: {
    flexDirection: 'row',
  },
  resultValueText: {
    flex: 1,
    textAlign: 'right',
  },
});

const mapPresenterToActions = (presenter: BookPresenter): Actions<BookPresenterInput> => ({
  actions: {
    addProgress: presenter.addProgress,
  },
});
const initialState: BookPresenterViewModel = {
  progress: [],
};

export const connectedComponent = connect<BookPresenter, BookPresenterInput, BookPresenterViewModel>
(new BookPresenter(), initialState, BookScreen, mapPresenterToActions);
