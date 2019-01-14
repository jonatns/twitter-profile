import React, { Component, useState, useEffect } from 'react';
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
import throttle from 'lodash.throttle';

import Card from '../components/card';
import ProfileCard from '../components/profile-card';
import TweetCard from '../components/tweet-card';
import LoadingCard from '../components/loading-card';
import ThemeToggler from '../components/theme-toggler';

import { ThemeContext } from '../components/theme-context';

const BASE_URL = 'https://twitter-profile-search.now.sh';

class Search extends Component {
  static getInitialProps = async ({ query }) => {
    const resp = await fetch(
      `${BASE_URL}/api/get-twitter-profile.js?screen_name=${query.q}`
    );

    if (resp.status === 200) {
      const profile = await resp.json();
      return { q: query.q || 'jonat_ns', profile };
    }
    return { q: query.q || 'jonat_ns' };
  };

  profileController = null;
  tweetsController = null;

  state = {
    tweets: [],
    loadingTweets: true,
    loadingProfile: false,
    lastSearch: this.props.q,
    screenName: this.props.q,
    profile: this.props.profile || null,
    inputFocused: false,
    smallestId: null,
    timelineUpdated: false
  };

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
    this.fetchProfileController = new AbortController();
    this.fetchTweets();
    this.updateUrl();
  }

  componentDidUpdate(previousProps) {
    if (previousProps.router.query.q !== this.props.router.query.q) {
      this.setState(
        {
          screenName: this.props.router.query.q,
          profile: null,
          tweets: [],
          smallestId: null
        },
        () => {
          this.fetchProfile();
          this.fetchTweets();
        }
      );
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
    this.fetchProfileController = null;
    this.fetchTweetsController = null;
  }

  updateUrl = () => {
    this.props.router.push(`/search?q=${this.state.screenName}`);
  };

  fetchProfile = async () => {
    if (this.fetchProfileController) {
      this.fetchProfileController.abort();
    }
    this.fetchProfileController = new AbortController();

    const { screenName } = this.state;

    this.setState({ loadingProfile: true });

    try {
      const resp = await fetch(
        `${BASE_URL}/api/get-twitter-profile.js?screen_name=${screenName}`,
        {
          signal: this.fetchProfileController.signal
        }
      );

      if (resp.status === 200) {
        const data = await resp.json();
        this.setState({ profile: data, loadingProfile: false });
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.log(err);
        this.setState({ profile: null, loadingProfile: false });
      }
    }
  };

  fetchTweets = async () => {
    if (this.fetchTweetsController) {
      this.fetchTweetsController.abort();
    }
    this.fetchTweetsController = new AbortController();

    const {
      lastSearch,
      screenName,
      smallestId,
      tweets,
      timelineUpdated
    } = this.state;

    if (timelineUpdated) {
      return;
    }

    this.setState({ loadingTweets: true, lastSearch: screenName });

    try {
      const resp = await fetch(
        `${BASE_URL}/api/get-twitter-timeline.js?max_id=${smallestId}&screen_name=${screenName}`,
        {
          signal: this.fetchTweetsController.signal
        }
      );

      if (resp.status === 200) {
        const data = await resp.json();
        const updatedState = { loadingTweets: false };

        if (data) {
          if (data.length > 0) {
            updatedState.smallestId = bigInt(data[data.length - 1].id_str)
              .minus(1)
              .toString();
            updatedState.tweets = [...tweets, ...data];
          } else {
            updatedState.timelineUpdated = true;
          }
        }

        this.setState(updatedState);
      } else {
        throw new Error('Failed to fetch tweets');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.log(err);
        this.setState({ smallestId: null, tweets: [], loadingTweets: false });
      }
    }
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 400;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
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
    if (e.target.nodeName !== 'INPUT' && this.state.inputFocused) {
      this.handleInputBlur();
    }
  };

  handleScrollEvent = ({ nativeEvent }) => {
    const { timelineUpdated } = this.state;

    if (!this.isCloseToBottom(nativeEvent) && timelineUpdated) {
      this.setState({ timelineUpdated: false });
    }
  };

  renderItem = ({ item, index }) => {
    return <TweetCard {...item} />;
  };

  render() {
    const {
      profile,
      loadingProfile,
      tweets,
      loadingTweets,
      screenName,
      inputFocused
    } = this.state;
    const { theme } = this.context;

    return (
      <View style={styles.container}>
        <Head>
          <title>Twitter Profile Search</title>
        </Head>
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.primary,
              borderBottomColor: theme.headerBorder
            }
          ]}
        >
          <View style={styles.headerContent} className="header-content">
            <TextInput
              ref="searchInput"
              placeholder="Search user by @"
              placeholderTextColor={theme.subText}
              value={screenName}
              onChange={this.handleInputChange}
              style={[
                styles.searchInput,
                {
                  color: theme.text,
                  backgroundColor: theme.secondary,
                  borderColor: theme.secondary
                },
                inputFocused && {
                  color: '#1EA1F2',
                  borderColor: '#1EA1F2',
                  backgroundColor: theme.primary
                }
              ]}
              onKeyPress={this.handleKeyPress}
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
            />
            <ThemeToggler />
          </View>
        </View>
        <View style={[styles.main, { backgroundColor: theme.secondary }]}>
          <FlatList
            className="list"
            contentContainerStyle={styles.listContent}
            data={tweets}
            keyExtractor={item => item.id + ''}
            renderItem={this.renderItem}
            onEndReached={() => this.fetchTweets()}
            onScroll={throttle(this.handleScrollEvent, 1500)}
            initialNumToRender={20}
            maxToRenderPerBatch={2}
            onEndReachedThreshold={0.8}
            ListHeaderComponent={<ProfileCard profile={profile} />}
            ListFooterComponent={<LoadingCard loading={loadingTweets} />}
          />
        </View>

        <style jsx>{`
          :global(.header-content) {
            width: 600px;
            align-self: center;
          }

          @media only screen and (max-width: 768px) {
            :global(.header-content) {
              padding: 0 10px !important;
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3000,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 53,
    borderBottomWidth: 1
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  main: {
    flex: 1,
    height: '100vh'
  },
  listContent: {
    alignSelf: 'center',
    marginTop: 63,
    width: 600
  },
  searchInput: {
    paddingLeft: 15,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 15,
    borderRadius: 50,
    outline: 'none',
    borderWidth: 1
  }
});

export default withRouter(Search);

Search.contextType = ThemeContext;
