import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Actions } from '../../Presenter/connect';
import { MainPresenterInput, MainPresenterViewModel } from './MainPresenter';

type Props = Actions<MainPresenterInput> & MainPresenterViewModel;
export class MainScreen extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome!!!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
