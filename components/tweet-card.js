import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

import Card from './card';
import UrlPreviewCard from './url-preview-card';
import SerializedTweet from './serialized-tweet';

const TweetCard = ({
  id,
  user,
  in_reply_to_status_id,
  in_reply_to_screen_name,
  text,
  entities
}) => {
  const userImage = user.profile_image_url_https.replace('_normal', '');
  const cleanedText = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').trim();

  return (
    <Card style={styles.container}>
      {({ theme }) => (
        <React.Fragment>
          <Image source={userImage} style={styles.userImage} />
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <Text style={[styles.userName, { color: theme.text }]}>
                {user.name}
              </Text>
              <Text style={[styles.userScreenName, { color: theme.subText }]}>
                @{user.screen_name}
              </Text>
            </View>
            {cleanedText ? (
              <SerializedTweet
                theme={theme}
                replyScreenName={
                  in_reply_to_status_id && in_reply_to_screen_name
                }
              >
                {cleanedText}
              </SerializedTweet>
            ) : null}
            {entities.media && (
              <View
                style={[
                  styles.tweetMediaWrapper,
                  { borderColor: theme.border }
                ]}
                className="tweet-media-wrapper"
              >
                <Image
                  source={entities.media[0].media_url_https}
                  style={styles.tweetMediaImage}
                />
              </View>
            )}
            {entities.urls && entities.urls.length > 0 && (
              <UrlPreviewCard theme={theme} {...entities.urls[0]} />
            )}
          </View>
          <style jsx>{`
            @media only screen and (max-width: 680px) {
              :global(.tweet-media-wrapper) {
                height: 140px;
              }
            }
          `}</style>
        </React.Fragment>
      )}
    </Card>
  );
};

export default TweetCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  content: {
    flex: 1,
    paddingLeft: 10
  },
  contentHeader: {
    flexDirection: 'row',
    marginBottom: 5
  },
  userName: {
    fontWeight: 'bold',
    marginRight: 4
  },
  userScreenName: {
    color: 'rgb(101, 119, 134)'
  },
  userImage: {
    width: 49,
    height: 49,
    borderRadius: 49 / 2
  },
  contentText: {
    flexDirection: 'row'
  },
  tweetMediaWrapper: {
    flex: 1,
    height: 300,
    width: '100%',
    borderRadius: 15,
    borderColor: 'rgb(230, 236, 240)',
    borderWidth: 1,
    marginTop: 10
  },
  tweetMediaImage: {
    flex: 1,
    borderRadius: 15
  }
});
