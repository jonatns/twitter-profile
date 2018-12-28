import React, { Component } from "react";
import Head from "next/head";
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
} from "react-native";
import fetch from "isomorphic-unfetch";
import bigInt from "big-integer";

import Card from "../components/card";
import ProfileCard from "../components/profile-card";
import LoadingCard from "../components/loading-card";

import styles from "./styles";

const BASE_URL =
  process.env.NODE_ENV !== "production" ? "http://localhost:8000" : "";

class TwitterFeed extends Component {
  state = {
    tweets: [],
    loadingTweets: false,
    loadingProfile: false,
    lastSearch: "jonat_ns",
    screenName: "jonat_ns",
    profile: null,
    inputFocused: false,
    searchResults: ["test1", "test2"]
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
      const res = await fetch(
        `${BASE_URL}/twitter/timeline?max_id=${this.smallestId}&&screen_name=${
          this.state.screenName
        }`
      );

      const tweets = await res.json();

      let newTweets = this.state.tweets.concat(tweets);

      if (tweets && tweets.length > 0) {
        this.smallestId = bigInt(tweets[tweets.length - 1].id_str)
          .minus(1)
          .toString();
      }

      this.setState({ tweets: newTweets, loadingTweets: false });
    });
  };

  fetchProfile = () => {
    this.setState({ loadingProfile: true }, async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/twitter/profile?screen_name=${this.state.screenName}`
        );

        const profile = await res.json();

        this.setState({ profile, loadingProfile: false });
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
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  handleInputChange = e => {
    this.setState({ screenName: e.target.value });
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
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
    if (e.target.nodeName !== "INPUT") {
      this.handleInputBlur();
    }
  };

  handleScrollEvent = ({ nativeEvent }) => {
    if (this.isCloseToBottom(nativeEvent) && !this.state.loadingTweets) {
      this.fetchTweets();
    }
  };

  render() {
    return (
      <div
        onClick={this.handleDocumentClick}
        style={{ height: "100%", width: "100%" }}
      >
        <Head>
          <title>react-native-web</title>
        </Head>
        <View
          style={styles.container}
          onTouchStart={this.handleInputFocusAndBlur}
        >
          <div className="header">
            <div className="header-content">
              <TextInput
                ref="searchInput"
                placeholder="Search user by @"
                value={this.state.screenName}
                onChange={this.handleInputChange}
                style={[
                  styles.searchInput,
                  this.state.inputFocused && {
                    color: "#1EA1F2",
                    borderColor: "#1EA1F2",
                    backgroundColor: "#fff"
                  }
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
              {!this.state.loadingProfile && (
                <div className="profile-card">
                  <ProfileCard profile={this.state.profile} />
                </div>
              )}

              {this.state.tweets.map(item => this.renderItem(item))}

              <LoadingCard isLoading={this.state.loadingTweets} />
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
