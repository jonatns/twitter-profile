import { FlatList, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useInfiniteQuery, useQuery } from 'react-query';

import ProfileCard from '../components/profile-card';
import TweetCard from '../components/tweet-card';
import LoadingCard from '../components/loading-card';

const UserTimeline = ({ screenName }) => {
  const renderItem = ({ item }) => <TweetCard key={item.id_str} {...item} />;

  const fetchProfile = async () => {
    const resp = await fetch(
      `/api/get-twitter-profile?screen_name=${screenName}`
    );
    return resp.json();
  };

  const { isLoading: isLoadingProfile, data: profile } = useQuery(
    ['profile', screenName],
    fetchProfile
  );

  const fetchTimeline = async (_key, maxId = null) => {
    const resp = await fetch(
      `/api/get-twitter-timeline?max_id=${maxId}&screen_name=${screenName}`
    );
    return resp.json();
  };

  const {
    status,
    data: timeline,
    fetchMore,
    isFetchingMore,
  } = useInfiniteQuery(`timeline:${screenName}`, fetchTimeline, {
    getFetchMore: (lastGroup) => {
      return BigInt(lastGroup[lastGroup.length - 1].id_str) - 1n;
    },
  });

  if (status === 'loading' || isLoadingProfile) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator animating size={26} />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={timeline.flatMap((page) => page)}
      keyExtractor={(item) => item.id_str}
      renderItem={renderItem}
      onEndReached={() => {
        if (!isFetchingMore) {
          fetchMore();
        }
      }}
      onEndReachedThreshold={0.8}
      initialNumToRender={7}
      ListHeaderComponent={<ProfileCard profile={profile} />}
      ListFooterComponent={<LoadingCard loading={isFetchingMore} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: 10,
    width: '100%',
    maxWidth: 600,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserTimeline;
