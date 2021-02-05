import React, {Component} from 'react';
import {connect} from 'react-redux';

import Slides from '../components/Slides';
import * as actions from '../actions';

const SLIDE_DATA = [
    {id: 0, title: 'Welcome!', caption: 'Swipe right to continue', color: '#5abf56'},
    {
        id: 1,
        caption: 'Add a patient...',
        imagePath: require('../../assets/static/gifs/01_create_patient.gif'),
        color: '#20967f'
    },
    {
        id: 2,
        caption: 'Search and filter...',
        imagePath: require('../../assets/static/gifs/02_search_options.gif'),
        color: '#378378'
    },
    {
        id: 3,
        caption: 'Fill out a questionnaire...',
        imagePath: require('../../assets/static/gifs/03_create_form.gif'),
        color: '#6770b5'
    }
];

class WelcomeScreen extends Component {
    onSlidesComplete = () => {
        this.props.setGreeted();
        this.props.navigation.navigate('App');
    }

    render() {
        return (
            <Slides data={SLIDE_DATA} onComplete={this.onSlidesComplete}/>
        );
    }
}

export default connect(null, actions)(WelcomeScreen);
