import React, { Component } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from 'next/router';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput
} from 'react-native';

import fetch from 'isomorphic-unfetch';
import bigInt from 'big-integer';
import { parse } from 'url';
import MicrolinkCard from '@microlink/react';

import Card from '../components/card';
import ProfileCard from '../components/profile-card';
import LoadingCard from '../components/loading-card';

import serializeTweets from '../utils/serialize-tweets';

import styles from './styles';

class TwitterFeed extends Component {
  static getInitialProps({ query }) {
    return { q: query.q || '@jonat_ns' };
  }

  state = {
    tweets: [],
    loadingTweets: false,
    loadingProfile: false,
    lastSearch: this.props.q,
    screenName: this.props.q,
    profile: null,
    inputFocused: false,
    smallestId: null
  };

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
    this.fetchProfile();
    this.fetchTweets();
    this.updateUrl();
  }

  componentDidUpdate(previousProps) {
    if (previousProps.router.query.q !== this.props.router.query.q) {
      this.setState({ screenName: this.props.router.query.q, profile: null, tweets: [], smallestId: null }, () => {
        this.fetchProfile();
        this.fetchTweets();
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  updateUrl = () => {
    const { router } = this.props;
    const { screenName } = this.state;
    router.push(`/search?q=${screenName}`);
  };

  fetchProfile = async () => {
    const { screenName } = this.state;

    this.setState({ loadingProfile: true });

    try {
      const resp = await fetch(
        `https://twitter-profile-search.now.sh/api/get-twitter-profile.js?screen_name=${screenName}`
      );
      const { status, data } = await resp.json();

      if (status === 'success') {
        this.setState({ profile: JSON.parse(data), loadingProfile: false });
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      console.log(err);
      this.setState({ profile: null, loadingProfile: false });
    }
  };

  fetchTweets = async () => {
    const { lastSearch, screenName, smallestId, tweets } = this.state;

    this.setState({ loadingTweets: true, lastSearch: screenName });

    console.log('fetching', this.onEndReachedCalledDuringMomentum);

    try {
      const resp = await fetch(
        `https://twitter-profile-search.now.sh/api/get-twitter-timeline.js?max_id=${smallestId}&screen_name=${screenName}`
      );
      const { status, data } = await resp.json();

      if (status === 'success') {
        const jsonData = JSON.parse(data);
        const updatedState = { loadingTweets: false };

        if (jsonData && jsonData.length > 0) {
          updatedState.smallestId = bigInt(jsonData[jsonData.length - 1].id_str)
            .minus(1)
            .toString();

          updatedState.tweets = [...tweets, ...jsonData];
        }

        this.setState(updatedState);
      } else {
        throw new Error('Failed to fetch tweets');
      }
    } catch (err) {
      console.log(err);
      this.setState({ smallestId: null, tweets: [], loadingTweets: false });
    }
  };

  renderTweet = ({ id, text, entities }) => {
    console.log(entities);
    return (
      <TouchableWithoutFeedback>
        <Card>
          <Text>{serializeTweets(text)}</Text>
          {entities.media && (
            <Image source={entities.media[0].media_url_https} style={styles.tweetMedia} className="tweet-media" />
          )}
          {entities.urls && entities.urls.length > 0 && (
            <MicrolinkCard url={entities.urls[0].expanded_url} target="_blank" />
          )}
        </Card>
      </TouchableWithoutFeedback>
    );
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 200;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  handleInputChange = e => {
    this.setState({ screenName: e.target.value });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      const { lastSearch, screenName } = this.state;
      if (lastSearch !== screenName && screenName !== '') {
        this.setState({ profile: null, tweets: [], smallestId: null }, () => {
          this.updateUrl();
          this.fetchProfile();
          this.fetchTweets();
        });
      }
    }
  };

  handleInputBlur = () => {
    this.setState({ inputFocused: false });
  };

  handleInputFocus = () => {
    this.setState({ inputFocused: true });
  };

  handleDocumentClick = e => {
    if (e.target.nodeName !== 'INPUT') {
      this.handleInputBlur();
    }
  };

  handleScrollEvent = ({ nativeEvent }) => {
    const { loadingTweets } = this.state;
    if (this.isCloseToBottom(nativeEvent) && !loadingTweets) {
      this.fetchTweets();
    }
  };

  fetchMoreTweets = () => {
    if (!this.state.loadingTweets) {
      this.fetchTweets();
    }
  };

  render() {
    const { profile, loadingProfile, tweets, loadingTweets, screenName, inputFocused, screenWidth } = this.state;

    const isMobile = screenWidth < 681;

    return (
      <View style={styles.container}>
        <Head>
          <title>Twitter Profile Search</title>
        </Head>

        <View style={styles.header}>
          <View className="header-content">
            <TextInput
              ref="searchInput"
              placeholder="Search user by @"
              value={screenName}
              onChange={this.handleInputChange}
              style={[
                styles.searchInput,
                inputFocused && { color: '#1EA1F2', borderColor: '#1EA1F2', backgroundColor: '#fff' }
              ]}
              onKeyPress={this.handleKeyPress}
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
            />
          </View>
        </View>
        <View style={styles.main}>
          <FlatList
            className="list"
            contentContainerStyle={styles.listContent}
            data={tweets}
            keyExtractor={item => item.id + ''}
            renderItem={({ item, index }) => {
              return this.renderTweet(item);
            }}
            onEndReached={this.fetchMoreTweets}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={() => (profile ? <ProfileCard profile={profile} /> : null)}
            ListFooterComponent={() => (loadingProfile || loadingTweets ? <LoadingCard /> : null)}
          />
        </View>

        <style jsx>{`
          :global(.header-content) {
            width: 600px;
            align-self: center;
            padding-left: 10px;
          }
          :global(.tweet-links) {
            color: #1ea1f2;
            text-decoration: none;
          }
          :global(.tweet-links):hover {
            text-decoration: underline;
          }
          :global(.microlink_card) {
            border-radius: 15px;
            margin-top: 10px;
          }

          @media only screen and (max-width: 680px) {
            :global(.header-content) {
              width: 100%;
            }
            :global(.list > div) {
              width: 100%;
              margin-top: 53px;
            }
          }
        `}</style>
      </View>
    );
  }
}

export default withRouter(TwitterFeed);
