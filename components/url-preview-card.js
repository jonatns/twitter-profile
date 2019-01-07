import { StyleSheet, View, Text, Image, Linking } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 15,
    borderColor: 'rgb(230, 236, 240)',
    borderWidth: 1,
    height: 124
  },
  imageWrapper: {
    alignSelf: 'stretch',
    borderRightColor: 'rgb(230, 236, 240)',
    borderRightWidth: 1,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15
  },
  image: {
    height: '100%',
    width: 124,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderRightColor: 'rgb(230, 236, 240)',
    borderRightWidth: 1
  },
  content: {
    flex: 1,
    padding: 10
  },
  title: {
    color: 'black',
    lineHeight: 20
  },
  description: {
    color: 'rgb(101, 119, 134)'
  }
});

const truncateText = (text, limit) => {
  if (!text || !limit) return;

  const content = text
    .trim()
    .split(' ')
    .slice(0, limit);

  return `${content.join(' ')}...`;
};

const UrlPreviewCard = ({ preview, expanded_url }) => {
  const { title, description, icons, logo } = preview;
  const imageSource = logo || (icons && icons.length > 0 && icons[0]);
  const displayUrl = new URL(expanded_url);

  return (
    <View accessibilityRole="link" href={expanded_url} target="_blank" style={styles.container} className="container">
      {imageSource && <Image style={styles.image} source={imageSource} resizeMode="cover" className="image" />}
      <View style={styles.content}>
        <Text style={styles.title} className="title">
          {title}
        </Text>
        {description && (
          <Text style={styles.description} className="description">
            {truncateText(description, 14)}
          </Text>
        )}
        <Text style={styles.description}>🔗{displayUrl.hostname}</Text>
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
};

export default UrlPreviewCard;
