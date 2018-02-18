import React, { Component, ComponentClass } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  FlatList,
  ListRenderItemInfo,
  ComponentProvider,
} from 'react-native';
import {
  BookPresenter,
  BookPresenterInput,
  BookPresenterViewModel, Presenter,
  PresenterOutput,
} from './BookPresenter';

///
const connect = <P extends Presenter<VM>, I, VM>
(presenter: P,
 initialState: VM,
 component: ComponentClass<Actions<I> & VM>,
 mapPresenterToActions: (presenter: P) => Actions<I>,
): ComponentProvider => {
  class PresenterProvider extends Component implements PresenterOutput<VM> {
    private readonly presenter: P;

    state: VM = initialState;

    constructor(props: any) {
      super(props);

      this.presenter = presenter;
      presenter.setOutput(this);
    }

    renderOutput(viewModel: Partial<VM>): void {
      this.setState(viewModel);
    }

    render() {
      const actions = mapPresenterToActions(this.presenter);
      const props = { ...actions, ...this.state as any };
      return React.createElement(component, props);
    }
  }

  return () => PresenterProvider;
};
interface Actions<T> {
  actions: T;
}
///

export class BookScreen extends
  Component<Actions<BookPresenterInput> & BookPresenterViewModel> {
  keyExtractor = (item: any) => String(item);

  render() {
    console.log('BookScreen render, props: ', this.props);
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            style={styles.list}
            data={[1, 2, 3, 4, 5]}
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

//
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
//

const ListItem = (item: ListRenderItemInfo<any>) => (
  <View style={styles.listItem} key={item.index}>
    <Text>{`Text - ${item.item}`}</Text>
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
