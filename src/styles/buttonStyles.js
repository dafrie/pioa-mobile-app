import {StyleSheet} from 'react-native';
import {Constants} from 'expo';

const {primaryColor, secondaryColor, errorColor, transparentPrimaryColor, textPrimaryColor, textSecondaryColor} = Constants.manifest.extra;

export default StyleSheet.create({
    containerStyles: {
        flex: 1,
        alignItems: 'center',
        margin: 15,
    },
    buttonStyles: {
        flex: 1,
        backgroundColor: secondaryColor,
        borderRadius: 2,
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    buttonTextStyles: {
        fontSize: 12,
        color: textSecondaryColor,
        fontStyle: 'italic'
    }
});
