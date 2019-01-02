import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3000,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 53,
    borderBottomWidth: 1,
    borderBottomColor: '#b0bec5'
  },
  main: {
    flex: 1,
    backgroundColor: 'rgb(230, 236, 240)',
    height: '100vh'
  },
  listContent: {
    alignSelf: 'center',
    marginTop: 63,
    width: 600
  },
  searchInput: {
    paddingLeft: 15,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 15,
    borderRadius: 50,
    backgroundColor: '#E6ECF0',
    outline: 'none',
    borderColor: '#E6ECF0',
    borderWidth: 1
  },
  tweetMedia: {
    flex: 1,
    height: 300,
    width: '100%',
    borderRadius: 15,
    borderColor: 'rgb(230, 236, 240)',
    borderWidth: 1,
    marginTop: 10
  }
});
