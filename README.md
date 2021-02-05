# pioa-app

React Native / Expo App for entry of medical questionnaires

### Configuration

- General configuration: .ENV file
- Styling
- Fonts: Use Fontello http://fontello.com/ to create config and \*.ttf file

## FAQ

- Unable to load a bundle: https://forums.expo.io/t/how-to-clear-the-react-native-packager/1352

## Publishing:

https://docs.expo.io/versions/latest/distribution/advanced-release-channels
https://docs.expo.io/versions/latest/guides/release-channels.html

First publish to staging...
`expo publish --release-channel staging`

Then test and get the id of the publish
`expo publish:history`

## Building:

`expo build:ios --release-channel production --clear-push-cert`
`expo build:android --release-channel production`

### Troubleshooting

- If you get an error as below:
  '''
  [20:43:32] Error while gathering & validating credentials
  [20:43:32] Reason: Unexpected response, raw: {
  "responseId": "61196bf7-71cc-4c5c-95d8-56b2233e43ad",
  "resultCode": 35,
  "resultString": "There were errors in the data supplied. Please correct and re-submit.",
  "userString": "Multiple profiles found with the name 'net.pioa.net AppStore'. Please remove the duplicate profiles and try again.",
  '''
  Remove the profisioning profiles here: https://developer.apple.com/account/ios/profile
