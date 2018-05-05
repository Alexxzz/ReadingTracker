import React from 'react';
import { ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import { ProgressViewModel } from './ProgressViewModel';

export const ListItem = (item: ListRenderItemInfo<ProgressViewModel>) => (
  <View style={styles.listItem} key={item.index}>
    <View style={styles.leftContainer}>
      <Text>{item.item.dayAndDate}</Text>
      <Text>{item.item.fromPage}</Text>
      <Text>{item.item.toPage}</Text>
    </View>
    <View style={styles.rightContainer}>
      <Text>{item.item.pagesRead}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    minHeight: 44,
    marginHorizontal: 16,
    paddingVertical: 5,
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    justifyContent: 'center',
  },
});
