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

  const {
    status,
    data: timeline,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['timeline', screenName],
    async ({ pageParam = null }) => {
      const resp = await fetch(
        `/api/get-twitter-timeline?max_id=${pageParam}&screen_name=${screenName}`
      );
      return resp.json();
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.length
          ? BigInt(lastPage[lastPage.length - 1].id_str) - 1n
          : false;
      },
    }
  );

  if (status === 'loading' || isLoadingProfile) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator animating size={26} />
      </View>
    );
  }

  const timelineData = timeline.pages.flatMap((t) => t);

  return (
    <>
      <FlatList
        removeClippedSubviews
        contentContainerStyle={styles.container}
        data={timelineData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => {
          if (!isFetchingNextPage && hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        initialNumToRender={3}
        maxToRenderPerBatch={150}
        ListHeaderComponent={<ProfileCard profile={profile} />}
      />
      <LoadingMore loading={isFetchingNextPage} />
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
