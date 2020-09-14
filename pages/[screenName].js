import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { StyleSheet, View, TextInput } from 'react-native';

import ThemeToggler from '../components/theme-toggler';
import { ThemeContext } from '../components/theme-context';
import UserTimeline from '../components/user-timeline';

const HEADER_HEIGHT = 53;

const UserTimelinePage = () => {
  const { theme } = React.useContext(ThemeContext);
  const inputRef = React.useRef(null);

  const [inputFocused, setInputFocused] = React.useState(false);

  const router = useRouter();

  const { screenName } = router.query;

  React.useEffect(() => {
    const handleDocumentClick = (e) => {
      if (e.target.nodeName !== 'INPUT' && inputFocused) {
        setInputFocused(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = screenName;
    }
  }, [screenName]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value !== '' && e.target.value !== screenName) {
        router.push(`/${e.target.value}`);
      }
    }
  };

  const toggleInputFocused = () => {
    setInputFocused(!inputFocused);
  };

  if (!screenName) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <Head>
        <title>Twitter Profile Search</title>
      </Head>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.primary,
            borderBottomColor: theme.headerBorder,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <TextInput
            ref={inputRef}
            placeholder="Search user by @"
            placeholderTextColor={theme.subText}
            defaultValue={screenName}
            style={[
              styles.searchInput,
              {
                color: theme.text,
                backgroundColor: theme.secondary,
                borderColor: theme.secondary,
              },
              inputFocused && {
                color: '#1EA1F2',
                borderColor: '#1EA1F2',
                backgroundColor: theme.primary,
              },
            ]}
            onKeyPress={handleKeyPress}
            onFocus={toggleInputFocused}
            onBlur={toggleInputFocused}
          />
          <ThemeToggler />
        </View>
      </View>
      <View style={[styles.content, { backgroundColor: theme.secondary }]}>
        <UserTimeline screenName={screenName} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh',
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
    height: HEADER_HEIGHT,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
    maxWidth: 600,
  },
  searchInput: {
    paddingLeft: 15,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 15,
    borderRadius: 50,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    marginTop: HEADER_HEIGHT,
  },
});

export default UserTimelinePage;
