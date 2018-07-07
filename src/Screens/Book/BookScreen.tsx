import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  FlatList,
} from 'react-native';
import {
  IBookPresenterInput,
  } from './IBookPresenterInput';
import { IActions } from '../../Presenter/connect';
import { ListItem } from './BookLogItem';
import { BookPresenterViewModel } from './BookPresenterViewModel';
import { ProgressViewModel } from './ProgressViewModel';
import { Navigation } from 'react-native-navigation/lib/dist';
import { NavigationProps } from 'react-native-navigation';
import { IBookScreenProps } from './bookScreenBuilder';

type Props = IActions<IBookPresenterInput> & BookPresenterViewModel & NavigationProps & IBookScreenProps;

export class BookScreen extends Component<Props> {
  public componentWillMount() {
    Navigation.setOptions(this.props.componentId, {
      topBar: {
        hidden: false,
        largeTitle: true,
        title: this.props.book.name,
      },
    });

    console.log('BookScreen componentWillMount');
    this.props.actions.start({
      name: '',
      progress: [],
      total: 0,
    });
  }

  public render() {
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

  private keyExtractor = (item: ProgressViewModel) => item.dayAndDate;
}

interface IResultProps {
  title: string;
  value: string;
}
const ResultText = (props: IResultProps) => (
  <View style={styles.resultContainer}>
    <Text>{props.title}</Text>
    <Text style={styles.resultValueText}>{props.value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
  footerContainer: {
    alignSelf: 'stretch',
    marginBottom: 24,
    marginHorizontal: 16,
  },
  list: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: 'lightgray',
    flex: 1,
  },
  resultContainer: {
    flexDirection: 'row',
  },
  resultValueText: {
    flex: 1,
    textAlign: 'right',
  },
});
