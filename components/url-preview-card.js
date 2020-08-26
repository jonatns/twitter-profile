import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Linking } from 'react-native';
import fetch from 'isomorphic-unfetch';

const BASE_URL =
  process.env.NODE_ENV !== 'production' ? 'http://localhost:5000' : '';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 1,
    height: 124,
  },
  imageWrapper: {
    alignSelf: 'stretch',
    borderRightWidth: 1,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  image: {
    height: '100%',
    width: 124,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderRightWidth: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  title: {
    color: 'black',
    lineHeight: 20,
  },
  description: {
    color: 'rgb(101, 119, 134)',
  },
});

const truncateText = (text, limit) => {
  if (!text || !limit) return;

  const content = text.trim().split(' ').slice(0, limit);

  return `${content.join(' ')}...`;
};

function UrlPreviewCard({ url, theme }) {
  const [preview, setPreview] = useState(null);
  const fetchController = new AbortController();

  const fetchData = async () => {
    try {
      const resp = await fetch(`/api/get-url-preview?url=${url}`, {
        signal: fetchController.signal,
      });
      const data = await resp.json();
      setPreview(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      fetchController.abort();
    };
  }, [url]);

  if (!preview) {
    return (
      <View
        style={[styles.container, { borderColor: theme.border }]}
        className="container"
      />
    );
  }

  const { title, description, images, url: link } = preview;
  const imageSource = images && images.length > 0 && images[0];
  const displayUrl = new URL(link);

  return (
    <View
      accessibilityRole="link"
      href={link}
      target="_blank"
      style={[styles.container, { borderColor: theme.border }]}
      className="container"
    >
      {imageSource && (
        <Image
          style={[styles.image, { borderColor: theme.border }]}
          source={imageSource}
          resizeMode="cover"
          className="image"
        />
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} className="title">
          {title}
        </Text>
        {description && (
          <Text
            style={[styles.description, { color: theme.subText }]}
            className="description"
          >
            {truncateText(description, 14)}
          </Text>
        )}
        <Text style={[styles.description, { color: theme.subText }]}>
          🔗{displayUrl.hostname}
        </Text>
      </View>
      <style jsx>{`
        @media only screen and (max-width: 680px) {
          :global(.container) {
            height: 84px;
          }
          :global(.title, .description) {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          :global(.image) {
            width: 84px !important;
          }
        }
      `}</style>
    </View>
  );
}

export default UrlPreviewCard;
