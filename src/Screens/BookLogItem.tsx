import React from 'react';
import { ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import { Progress } from './BookPresenter';

export const ListItem = (item: ListRenderItemInfo<Progress>) => (
  <View style={styles.listItem} key={item.index}>
    <Text>{`Day 1 - ${item.item.date.toDateString()}`}</Text>
    <Text>{`To page ${item.item.page}`}</Text>
  </View>
);

const styles = StyleSheet.create({
  listItem: {
    minHeight: 44,
    marginHorizontal: 16,
  },
});
