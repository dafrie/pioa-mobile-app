import React, {Component} from 'React';
import {View, Text, ScrollView, Dimensions, Image} from 'react-native';
import {Button} from 'react-native-elements';
import {Constants} from "expo";

const {primaryColor, secondaryColor, errorColor, transparentPrimaryColor, textPrimaryColor, textSecondaryColor} = Constants.manifest.extra;


const SCREEN_WIDTH = Dimensions.get('window').width;

class Slides extends Component {

    renderLastSlide(index) {
        if (index === this.props.data.length - 1) {
            return (
                <Button
                    title="Start!"
                    raised
                    buttonStyle={styles.buttonStyles}
                    onPress={this.props.onComplete}
                />
            )
        }
    }

    renderTitleSlide(slide) {
        if (slide.title) {
            return (
                <View style={[styles.flex1, styles.centeredContainerStyles]}>
                    <Text style={styles.titleStyles}>{slide.title}</Text>
                    <Text style={styles.captionStyles}>{slide.caption}</Text>
                </View>
            )
        }
    }

    renderImageSlide(slide, index) {
        if (slide.imagePath) {
            return (
                <View style={[styles.flex1, styles.centeredContainerStyles]}>
                    <View style={{flex: 1}}>
                    </View>
                    <View style={{flex: 4, justifyContent: 'flex-end'}}>
                            <Image style={styles.imageStyles} source={slide.imagePath}/>
                    </View>
                    <View style={{flex: 2, justifyContent: 'center'}}>
                        <Text style={styles.captionStyles}>{slide.caption}</Text>
                        {this.renderLastSlide(index)}
                    </View>
                </View>
            )
        }

    }


    renderSlides() {
        return this.props.data.map((slide, index) => {
            return (
                <View
                    key={slide.id}
                    style={[
                        styles.slideStyles,
                        {backgroundColor: slide.color}]}
                >
                    {this.renderTitleSlide(slide)}
                    {this.renderImageSlide(slide, index)}
                </View>
            );
        });
    }

    render() {
        return (
            <ScrollView
                horizontal
                pagingEnabled
                style={styles.flex1}
            >
                {this.renderSlides()}
            </ScrollView>
        );
    }
}

const styles = {
    flex1: {
        flex: 1,
    },
    slideStyles: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH,
    },
    centeredContainerStyles: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleStyles: {
        fontSize: 48,
        color: textPrimaryColor,
        fontWeight: 'bold'
    },
    captionStyles: {
        fontSize: 30,
        color: textPrimaryColor,
        marginVertical: 20,
    },
    buttonStyles: {
        backgroundColor: primaryColor,
        marginHorizontal: '20%',
        //marginTop: 15,
        paddingHorizontal: '10%',
        //paddingVertical: 10
    },
    imageStyles: {
        borderRadius: 18,
        borderWidth: 2,
        //flex: 0.8,
        justifyContent: 'flex-end',
        //height: '40%',
        // height: '100%',
        //paddingTop: '10%',
        //marginTop: '15%',
    }
};

export default Slides;
