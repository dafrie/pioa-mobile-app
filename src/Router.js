import React from 'react';
import { Constants, AppLoading } from 'expo';
import { Easing, Animated, createStackNavigator, createDrawerNavigator, createSwitchNavigator } from 'react-navigation';

import AuthLoadingScreen from './screens/AuthLoadingScreen';
import SignInScreen from './screens/SignInScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import DeckScreen from './screens/DeckScreen';
import PatientScreen from './screens/PatientScreen';
import PatientEditScreen from './screens/PatientEditScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import Drawer from './components/Drawer';
import Spinner from './components/Spinner';

const { primaryColor, secondaryColor, errorColor, transparentPrimaryColor, textPrimaryColor, textSecondaryColor } = Constants.manifest.extra;

const AppRouter = createDrawerNavigator(
    {
        MainDeck: {
            screen: createStackNavigator(
                {
                    Deck: { screen: DeckScreen },
                    Patient: { screen: PatientScreen },
                    PatientEdit: { screen: PatientEditScreen },
                    Questionnaire: { screen: QuestionnaireScreen },
                },
                {
                    defaultNavigationOptions: {
                        headerTintColor: textPrimaryColor,
                        headerStyle: {
                            backgroundColor: primaryColor,
                            elevation: 20,
                            shadowOpacity: 20,
                        },
                        headerTitleStyle: {
                            color: textPrimaryColor,
                            fontWeight: 'bold',
                            fontSize: 20,
                        },
                        transitionConfig: () => {
return ({
                            transitionSpec: {
                                duration: 0,
                                timing: Animated.timing,
                                easing: Easing.step0,
                            },
                        }); 
},
                    },
                }
            ),
        },
    },
    {
        navigationOptions: {
            tabBarVisible: false,
        },
        lazyLoad: true,
        contentComponent: Drawer,
    }
);

export default createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        Auth: createStackNavigator(
            {
                SignIn: { screen: SignInScreen },
            },
            { headerMode: 'none', initialRouteName: 'SignIn' }
        ),
        Welcome: createStackNavigator({ Welcome: WelcomeScreen }, { headerMode: 'none' }),
        App: AppRouter,
    },
    {
        initialRouteName: 'AuthLoading',
        headerMode: 'none',
    }
);
