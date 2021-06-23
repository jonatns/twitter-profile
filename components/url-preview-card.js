import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  useWindowDimensions,
} from 'react-native';

function UrlPreviewCard({ url, theme }) {
  const fetchController = React.useRef(null);
  const [preview, setPreview] = useState(null);
  const windowWidth = useWindowDimensions().width;

  useEffect(() => {
    const fetchData = async () => {
      fetchController.current = new AbortController();

      try {
        const resp = await fetch(`/api/get-url-preview?url=${url}`, {
          signal: fetchController.current.signal,
        });
        const data = await resp.json();
        setPreview(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log(err);
        }
      }
    };

    fetchData();

    return () => {
      fetchController.current.abort();
    };
  }, [url]);

  let previewHeight = 84;

  if (windowWidth > 490 && windowWidth < 580) {
    previewHeight = 104;
  } else if (windowWidth >= 580) {
    previewHeight = 124;
  }

  if (!preview) {
    return (
      <View
        style={[
          styles.container,
          { borderColor: theme.border, paddingTop: previewHeight },
        ]}
        className="container"
      />
    );
  }

  const { title, description, images, favicons, url: link } = preview;
  let imageSource = null;

  if (images && images.length) {
    imageSource = images[0];
  } else if (favicons && favicons.length) {
    imageSource = favicons[0];
  }

  const displayUrl = new URL(link);

  return (
    <View
      accessibilityRole="link"
      href={link}
      target="_blank"
      style={[
        styles.container,
        { borderColor: theme.border, height: previewHeight },
      ]}
    >
      {imageSource ? (
        <Image
          style={[
            styles.image,
            { borderColor: theme.border, width: previewHeight },
          ]}
          source={imageSource}
          resizeMode="cover"
        />
      ) : null}
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>
        {description && windowWidth > 490 ? (
          <Text
            style={[styles.description, { color: theme.subText }]}
            numberOfLines={2}
          >
            {description}
          </Text>
        ) : null}
        <Text style={[styles.description, { color: theme.subText }]}>
          🔗{displayUrl.hostname}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 1,
  },
  imageWrapper: {
    alignSelf: 'stretch',
    borderRightWidth: 1,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  image: {
    height: '100%',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderRightWidth: 1,
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    color: 'black',
    lineHeight: 20,
  },
  description: {
    color: 'rgb(101, 119, 134)',
  },
});

export default UrlPreviewCard;
