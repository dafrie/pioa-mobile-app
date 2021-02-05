import { Platform } from 'react-native';

export function getTypedIonIcon(name) {
  return Platform.OS === 'ios' ? `ios-${name}` : `md-${name}`;
}
