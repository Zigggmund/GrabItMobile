import { StyleSheet, Text, TextProps } from 'react-native';

export default function HeadingText(props: TextProps) {
  return <Text {...props} style={[styles.text, props.style]} />;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Roboto',
  },
});
