import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    minHeight: 256,
    paddingVertical: 24,
  },
  headerTitle: {
    textAlign: 'center',
    marginVertical: 24,
    zIndex: 1,
    
  },
  headerTitle: {
    marginHorizontal: 16,
    fontSize:18
  },
  horizontalItem: {
    width: 256,
    marginHorizontal: 8,
  },
  horizontalList: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  headerDescription: {
    zIndex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  content_Container: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  authoringInfoContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  dateLabel: {
    marginHorizontal: 8,
    fontSize:18
  },
  authoringContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  radio: {
    margin: 2,
  },
});

export default styles;
