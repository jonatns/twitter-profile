import React, { Component } from 'react';
import Head from 'next/head';
import { withRouter } from 'next/router';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  TextInput
} from 'react-native';
import fetch from 'isomorphic-unfetch';
import bigInt from 'big-integer';
import { parse } from 'url';

import Card from '../components/card';
import ProfileCard from '../components/profile-card';
import LoadingCard from '../components/loading-card';

import styles from './styles';

class TwitterFeed extends Component {
  static getInitialProps({ query }) {
    return { q: query.q || 'jonat_ns' };
  }

  state = {
    tweets: [],
    loadingTweets: true,
    loadingProfile: true,
    lastSearch: this.props.q,
    screenName: this.props.q,
    profile: null,
    inputFocused: false,
    searchResults: ['test1', 'test2'],
    smallestI: null
  };

  componentDidMount() {
    this.fetchProfile();
    this.fetchTweets();
    this.updateUrl();
  }

  updateUrl = () => {
    const { router } = this.props;
    const { screenName } = this.state;
    router.push(`/search?q=${screenName}`);
  };

  fetchProfile = () => {
    this.setState({ loadingProfile: true }, async () => {
      const { screenName } = this.state;

      try {
        const resp = await fetch(`/api/get-twitter-profile.js?screen_name=${screenName}`);
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
    });
  };

  fetchTweets = () => {
    const { lastSearch, screenName } = this.state;
    const preFetchState = { loadingTweets: true };

    if (lastSearch !== screenName) {
      preFetchState.lastSearch = screenName;
      preFetchState.tweets = [];
      preFetchState.smallestId = null;
    }

    this.setState(preFetchState, async () => {
      const { smallestId, screenName, tweets } = this.state;

      try {
        const resp = await fetch(`/api/get-twitter-timeline.js?max_id=${smallestId}&screen_name=${screenName}`);
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
    });
  };

  renderItem = ({ id, text }) => {
    return (
      <div className="hover" key={id}>
        <TouchableWithoutFeedback>
          <Card>
            <Text>{text}</Text>
          </Card>
        </TouchableWithoutFeedback>
      </div>
    );
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 400;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  handleInputChange = e => {
    this.setState({ screenName: e.target.value });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      const { lastSearch, screenName } = this.state;
      if (lastSearch !== screenName && screenName !== '') {
        this.updateUrl();
        this.fetchProfile();
        this.fetchTweets();
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

  render() {
    const { profile, loadingProfile, tweets, loadingTweets, screenName, inputFocused } = this.state;

    return (
      <div onClick={this.handleDocumentClick} style={{ height: '100%', width: '100%' }}>
        <Head>
          <title>Twitter Profile Search</title>
        </Head>
        <View style={styles.container} onTouchStart={this.handleInputFocusAndBlur}>
          <div className="header">
            <div className="header-content">
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
            </div>
          </div>
          <ScrollView
            style={styles.content}
            contentContainerStyle={[styles.scrollViewContainer]}
            onScroll={this.handleScrollEvent}
            scrollEventThrottle={400}
          >
            <div className="card-container">
              {!loadingProfile && (
                <div className="profile-card">
                  <ProfileCard profile={profile} />
                </div>
              )}

              {tweets.map(item => this.renderItem(item))}

              <LoadingCard isLoading={loadingTweets} />
            </div>
          </ScrollView>

          <style jsx>{`
            :global(*) {
              font-size: 16px !important;
              fontfamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif' !important;
            }
            :global(.hover) {
              cursor: pointer;
              transition: all 0.25s ease-in-out;
            }
            :global(.hover):hover {
              opacity: 0.6;
            }
            :global(.header) {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              z-index: 3000;
              display: flex;
              justify-content: center;
              background-color: #fff;
              height: 50px;
              border-bottom: 1px solid #b0bec5;
            }
            :global(.header-content) {
              width: 600px;
              align-self: center;
              padding-left: 10px;
            }
            :global(.card-container) {
              align-self: center;
              margin-top: 50px;
              width: 600px;
            }
            :global(.profile-card) {
              margin-bottom: 10px;
            }

            @media only screen and (max-width: 680px) {
              :global(.header-content) {
                width: 100%;
              }
              :global(.card-container) {
                width: 100%;
              }
              :global(*) {
                font-size: 14px !important;
              }
            }
          `}</style>
        </View>
      </div>
    );
  }
}

export default withRouter(TwitterFeed);
