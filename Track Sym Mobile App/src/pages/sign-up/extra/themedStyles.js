import { StyleService } from '@ui-kitten/components';

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'background-basic-color-1',
  },
  headerContainer: {
    minHeight: 216,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 44,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
  },
  socialAuthContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  socialAuthButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  socialAuthHintText: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  formContainer: {
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  evaButton: {
    maxWidth: 100,
    paddingHorizontal: 0,
  },
  backContainer: {
    justifyContent: 'flex-start',
  },
  signInButton: {
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
  signUpButton: {
    marginTop: 15,
    marginHorizontal: 16,
  },
  termsButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  socialAuthIcon: {
    tintColor: 'text-basic-color',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
  },
  divider: {
    flex: 1,
  },
  orLabel: {
    marginHorizontal: 8,
  },
  emailSignLabel: {
    alignSelf: 'center',
    marginTop: 20,
  },
  formInput: {
    marginTop: 16,
  },
  termsCheckBox: {
    marginTop: 20,
  },
  termsCheckBoxText: {
    fontSize: 11,
    lineHeight: 14,
    color: 'text-hint-color',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default themedStyles;
