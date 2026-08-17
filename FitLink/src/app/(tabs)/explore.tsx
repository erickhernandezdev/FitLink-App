import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Explore: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Este es el historial de entrenamientos</Text>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    fontSize: 20
  }
});
