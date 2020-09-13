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

const SerializedTweet = React.memo(function SerializedTweet({
  children,
  replyScreenName,
  theme,
}) {
  const content = children.split(/(@[\w_-]+)/gi);

  for (let i = 1; i < content.length; i += 2) {
    if (replyScreenName) {
      content[i] = (
        <React.Fragment key={i}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: theme.subText }}>Replying to </Text>
            <Link href={`/search?q=${content[i].replace('@', '')}`}>
              <Text
                accessibilityRole="link"
                style={styles.link}
                className="link"
              >
                {content[i]}
              </Text>
            </Link>
          </View>
          {'\n'}
        </React.Fragment>
      );
      // Remove beginning white space
      content[i + 1] = content[i + 1].trim();
    } else {
      content[i] = (
        <Link href={`/search?q=${content[i].replace('@', '')}`} key={i}>
          <Text accessibilityRole="link" style={styles.link} className="link">
            {content[i]}
          </Text>
        </Link>
      );
    }
  }

  return (
    <Text style={[styles.container, { color: theme.text }]}>
      {content}
      <style jsx>{`
        :global(.link):hover {
          text-decoration: underline;
        }
      `}</style>
    </Text>
  );
});

export default SerializedTweet;
