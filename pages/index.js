import React, { Component } from 'react';
import Head from 'next/head';
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

import Card from '../components/card';
import ProfileCard from '../components/profile-card';
import LoadingCard from '../components/loading-card';

import styles from './styles';

class TwitterFeed extends Component {
  state = {
    tweets: [],
    loadingTweets: false,
    loadingProfile: false,
    lastSearch: 'jonat_ns',
    screenName: 'jonat_ns',
    profile: null,
    inputFocused: false,
    searchResults: ['test1', 'test2']
  };

  smallestId = null;

  fetchTweets = () => {
    const newState = { loadingTweets: true };
    if (this.state.lastSearch !== this.state.screenName) {
      newState.lastSearch = this.state.screenName;
      newState.tweets = [];
      this.smallestId = null;
    }

    this.setState(newState, async () => {
      try {
        const resp = await fetch(
          `/api/get-twitter-timeline.js?max_id=${this.smallestId}&&screen_name=${this.state.screenName}`
        );
        const data = await resp.json();

        if (data.statusCode === 404) {
          throw new Error();
        }

        let newTweets = this.state.tweets.concat(data);

        if (tweets && tweets.length > 0) {
          this.smallestId = bigInt(tweets[tweets.length - 1].id_str)
            .minus(1)
            .toString();
        }

        this.setState({ tweets: newTweets, loadingTweets: false });
      } catch (err) {
        this.setState({ tweets: [], loadingTweets: false });
      }
    });
  };

  fetchProfile = () => {
    this.setState({ loadingProfile: true }, async () => {
      try {
        const resp = await fetch(`/api/get-twitter-profile.js?screen_name=${this.state.screenName}`);
        const data = await resp.json();

        if (data.statusCode === 404) {
          throw new Error();
        }

        this.setState({ data, loadingProfile: false });
      } catch (e) {
        this.setState({ profile: null, loadingProfile: false });
      }
    });
  };

  componentWillMount() {
    this.fetchProfile();
    this.fetchTweets();
  }

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
      if (this.state.lastSearch !== this.state.screenName) {
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
    if (this.isCloseToBottom(nativeEvent) && !this.state.loadingTweets) {
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
              {!loadingProfile && profile && (
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

export default TwitterFeed;
