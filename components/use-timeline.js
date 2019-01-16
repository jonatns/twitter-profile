import React, { useState, useEffect } from 'react';
import bigInt from 'big-integer';

const BASE_URL = 'https://twitter-profile-search.now.sh';

function useTimeline(screenName) {
  const [fetching, setFetching] = useState(false);
  const [{ timeline, smallestId }, setTimeline] = useState({
    timeline: [],
    smallestId: null
  });

  const fetchTimeline = async () => {
    setFetching(true);

    try {
      const resp = await fetch(
        `${BASE_URL}/api/get-twitter-timeline.js?max_id=${smallestId}&screen_name=${screenName}`
      );

      if (resp.status === 200) {
        const data = await resp.json();

        if (data && data.length > 0) {
          setTimeline({
            timeline: [...timeline, ...data],
            smallestId: bigInt(data[data.length - 1].id_str)
              .minus(1)
              .toString()
          });
          setFetching(false);
        }
      } else {
        throw new Error('Failed to fetch tweets');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.log(err);
        setTimeline({
          timeline: [],
          smallestId: null
        });
        setFetching(false);
      }
    }
  };

  useEffect(
    () => {
      fetchTimeline();
    },
    [screenName]
  );

  return { timeline, setTimeline, fetchingTimeline: fetching };
}

export default useTimeline;
