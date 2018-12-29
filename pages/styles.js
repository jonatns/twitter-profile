import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%'
  },
  content: {
    backgroundColor: 'rgb(230, 236, 240)'
  },
  scrollViewContainer: {
    width: '100%'
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
  }
});
