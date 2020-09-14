import { FlatList, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useInfiniteQuery, useQuery } from 'react-query';

import ProfileCard from '../components/profile-card';
import TweetCard from '../components/tweet-card';
import LoadingMore from './loading-more';

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
    canFetchMore,
    fetchMore,
    isFetchingMore,
  } = useInfiniteQuery(`timeline:${screenName}`, fetchTimeline, {
    getFetchMore: (lastGroup) => {
      if (lastGroup.length) {
        return BigInt(lastGroup[lastGroup.length - 1].id_str) - 1n;
      }

      return false;
    },
  });

  if (status === 'loading' || isLoadingProfile) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator animating size={26} />
      </View>
    );
  }

  const timelineData = timeline.flatMap((t) => t);

  return (
    <>
      <FlatList
        removeClippedSubviews
        contentContainerStyle={styles.container}
        data={timelineData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => {
          if (!isFetchingMore && canFetchMore) {
            fetchMore();
          }
        }}
        onEndReachedThreshold={0.5}
        initialNumToRender={3}
        maxToRenderPerBatch={150}
        ListHeaderComponent={<ProfileCard profile={profile} />}
      />
      <LoadingMore loading={isFetchingMore} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: 10,
    paddingBottom: 80,
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
