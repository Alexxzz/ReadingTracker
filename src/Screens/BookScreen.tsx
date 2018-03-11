import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  FlatList,
} from 'react-native';
import {
  BookPresenterInput,
  BookPresenterViewModel,
  ProgressViewModel,
} from './BookPresenter';
import { Actions } from '../Presenter/connect';
import { ListItem } from './BookLogItem';

export class BookScreen extends Component<Actions<BookPresenterInput> & BookPresenterViewModel> {

  keyExtractor = (item: ProgressViewModel) => item.dayAndDate;

  componentWillMount() {
    this.props.actions.start();
  }

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
          <Button title={'Add'} onPress={() => this.props.actions.addProgress()}/>
          <View>
            <ResultText title={'Pages read:'} value={'x(y%)'} />
            <ResultText title={'Pages left:'} value={'z(zz%)'} />
          </View>
        </View>
      </View>
    );
  }
}

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
