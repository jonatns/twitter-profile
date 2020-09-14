import React from 'react';
import Link from 'next/link';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    lineHeight: 20,
  },
  link: {
    color: '#1ea1f2',
  },
});

const SerializedTweet = ({ children, replyScreenName, theme }) => {
  const content = children.split(/(@[\w_-]+)/gi);

  for (let i = 1; i < content.length; i += 2) {
    let screenName = content[i].replace('@', '');

    let screenNameLink = (
      <Link href={`/[screenName]`} as={`/${screenName}`} passHref>
        <Text
          accessibilityRole="link"
          style={styles.link}
          className="screen-name-link"
        >
          {content[i]}
        </Text>
      </Link>
    );

    if (replyScreenName) {
      content[i] = (
        <React.Fragment key={i}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: theme.subText }}>Replying to </Text>
            {screenNameLink}
          </View>
          {'\n'}
        </React.Fragment>
      );

      // Remove beginning white space
      content[i + 1] = content[i + 1].trim();
    } else {
      content[i] = <React.Fragment key={i}>{screenNameLink}</React.Fragment>;
    }
  }

  return (
    <Text style={[styles.container, { color: theme.text }]}>{content}</Text>
  );
};

export default SerializedTweet;
