import React, { useState, useEffect } from 'react';

const BASE_URL = 'https://twitter-profile-search.now.sh';

function useProfile(screenName) {
  const [fetching, setFetching] = useState(false);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    setFetching(true);

    try {
      const resp = await fetch(
        `${BASE_URL}/api/get-twitter-profile.js?screen_name=${screenName}`
      );

      if (resp.status === 200) {
        const data = await resp.json();
        setProfile(data);
        setFetching(false);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.log(err);
        setProfile(null);
        setFetching(false);
      }
    }
  };

  useEffect(
    () => {
      fetchProfile();
    },
    [screenName]
  );

  return { profile, setProfile };
}

export default useProfile;
