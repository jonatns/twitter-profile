import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import Card from './card';
import SerializedTweet from './serialized-tweet';

const ProfileCard = ({ profile }) => {
  const {
    name,
    profile_image_url_https,
    screen_name,
    profile_banner_url,
    description,
    location,
    friends_count,
    followers_count,
  } = profile;

  const imageUrl = profile_image_url_https.replace('_normal', '');

  return (
    <Card style={styles.container}>
      {({ theme }) => (
        <React.Fragment>
          <div className="profile-banner">
            {profile_banner_url && (
              <Image source={{ uri: profile_banner_url }} />
            )}
          </div>
          <div
            style={{ backgroundColor: theme.primary }}
            className="profile-image-container"
          >
            <Image source={{ uri: imageUrl }} />
          </div>

          <div className="profile-name">
            <Text style={[styles.profileName, { color: theme.text }]}>
              {name}
            </Text>
          </div>
          <Text style={[styles.screenName, { color: theme.subText }]}>
            @{screen_name}
          </Text>
          <Text style={[styles.profileDescription, { color: theme.text }]}>
            <SerializedTweet theme={theme}>{description}</SerializedTweet>
          </Text>
          {location ? (
            <Text style={[styles.screenName, { color: theme.subText }]}>
              📍{location}
            </Text>
          ) : null}
          <View style={[styles.friendsAndFollowers, styles.inline]}>
            <View style={styles.inline}>
              <Text style={[styles.bold, { color: theme.text }]}>
                {friends_count}
              </Text>
              <Text style={[styles.screenName, { color: theme.subText }]}>
                {' '}
                Following
              </Text>
            </View>
            <View style={[styles.inline, styles.followers]}>
              <Text style={[styles.bold, { color: theme.text }]}>
                {followers_count}
              </Text>
              <Text style={[styles.screenName, { color: theme.subText }]}>
                {' '}
                Followers
              </Text>
            </View>
          </View>
          <style jsx>{`
            :global(.profile-banner) {
              height: 200px;
              background-color: #ccd6de;
              margin: -10px;
            }
            :global(.profile-banner > div) {
              height: 100%;
              width: 100%;
            }
            :global(.profile-image-container) {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: -75px;
              height: 138px;
              width: 138px;
              border-radius: 50%;
              background-color: #fff;
              margin-bottom: 10px;
              z-index: 1;
            }
            :global(.profile-image-container > div) {
              height: 130px;
              width: 130px;
              border-radius: 50%;
            }
            :global(.profile-name > div) {
              font-size: 18px !important;
            }
            @media only screen and (max-width: 680px) {
              :global(.profile-banner) {
                height: 120px;
              }
              :global(.profile-image-container) {
                margin-top: -25px;
                height: 84px;
                width: 84px;
                border-radius: 50%;
              }
              :global(.profile-image-container > div) {
                height: 80px;
                width: 80px;
                border-radius: 50%;
              }
              :global(.profile-name > div) {
                font-size: 16px !important;
              }
            }
          `}</style>
        </React.Fragment>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    padding: 10,
  },
  profileName: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  screenName: {
    color: 'rgb(101, 119, 134)',
  },
  profileDescription: {
    marginTop: 10,
    marginBottom: 10,
  },
  friendsAndFollowers: {
    marginTop: 5,
    marginBottom: -3,
  },
  inline: {
    flexDirection: 'row',
  },
  bold: {
    fontWeight: 'bold',
  },
  followers: {
    marginLeft: 20,
  },
});

export default ProfileCard;
