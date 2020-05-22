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
  headerDescription: {
    zIndex: 1,
  },
  contentContainer: {
    // flex: 1,
    padding: 24,
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
  },
  authoringContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 20,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});

export default styles;
