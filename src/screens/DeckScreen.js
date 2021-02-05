import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Dimensions, DeviceInfo, Platform } from 'react-native';
import { Header, SafeAreaView } from 'react-navigation';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { Icon, ButtonGroup } from 'react-native-elements';
import { withNamespaces } from 'react-i18next';
import { Ionicons, createIconSetFromFontello } from '@expo/vector-icons';

import * as actions from '../actions';

import PatientList from '../components/PatientList';
import { getTypedIonIcon } from '../utils/getPlatformIcons';
import { getHeaderHeight } from '../utils/headerHeight';

const { primaryColor, secondaryColor, errorColor, transparentPrimaryColor, textPrimaryColor, textSecondaryColor } = Constants.manifest.extra;

const filterBarButtons = ['SHOW_ALL', 'SHOW_30D', 'SHOW_6M', 'SHOW_1Y', 'SHOW_STAT'];

const searchBarButtons = ['SEARCH_ALL', 'SEARCH_ID', 'SEARCH_NOM', 'SEARCH_DOB', 'SEARCH_DIAG', 'SEARCH_COM'];

class DeckScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const params = navigation.state.params || {};
    const iconSize = Platform.OS === 'ios' ? 23 : 26;
    return {
      header: (
        <View style={styles.headerContainerStyles}>
          <View style={styles.headerSubContainerStyles}>
            <TouchableOpacity
              onPress={() => {
                return navigation.openDrawer();
              }}
            >
              <Icon type="ionicon" name={getTypedIonIcon('options')} title="abcd" size={iconSize} color={textPrimaryColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={params.toggleSync} onLongPress={params.onSyncAllUnsynced}>
              <View style={styles.extraIconWrapper}>
                <Icon name={getTypedIonIcon('sync')} type="ionicon" color={params.syncSwitch ? textPrimaryColor : errorColor} size={iconSize} />
                <View style={styles.absoluteStyles}>
                  <Text style={styles.iconTextStyles}>{params.syncQueueLength || ''}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.headerSubContainerStyles, styles.headerTitleStyles]}>
            <Text fontSize={iconSize} style={styles.headerTitleTextStyles}>
              {screenProps.t('navigation:deckTitle')}
            </Text>
          </View>

          <View style={styles.headerSubContainerStyles}>
            <TouchableOpacity style={styles.headerButtonStyles} onPress={params.toggleFilter}>
              <View style={styles.extraIconWrapper}>
                <Icon name={Platform.OS === 'ios' ? 'ios-funnel' : 'md-funnel'} type="ionicon" color={textPrimaryColor} size={iconSize} />
                {params.selectFilterActive ? (
                  <Icon type="entypo" name="triangle-up" color={textPrimaryColor} size={12} containerStyle={[styles.extraIconContainerStyles]} />
                ) : null}
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButtonStyles} onPress={params.toggleSearch}>
              <View style={styles.extraIconWrapper}>
                <Icon name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} type="ionicon" color={textPrimaryColor} size={iconSize} />
                {params.searchFilterActive ? (
                  <Icon type="entypo" name="triangle-up" color={textPrimaryColor} size={12} containerStyle={[styles.extraIconContainerStyles]} />
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    };
  };

  state = {
    syncQueueLength: this.props.syncQueueLength,
    syncSwitch: this.props.settings.syncSwitch
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { syncQueueLength } = nextProps;
    const { syncSwitch } = nextProps.settings;
    if (syncQueueLength !== nextState.syncQueueLength) {
      this.setState({ syncQueueLength });
      this.props.navigation.setParams({
        syncQueueLength
      });
    }
    if (syncSwitch !== nextState.syncSwitch) {
      this.setState({ syncSwitch });
      this.props.navigation.setParams({
        syncSwitch
      });
    }
    return true;
  }

  componentWillMount() {
    this.props.navigation.setParams({
      toggleSearch: this.toggleSearch,
      toggleFilter: this.toggleFilter,
      toggleSync: this.toggleSync,
      onSyncAllUnsynced: this.onSyncAllUnsynced,
      syncSwitch: this.props.settings.syncSwitch,
      syncQueueLength: this.props.syncQueueLength,
      searchFilterActive: this.props.uiPatients.searchFilter !== 'SEARCH_ALL',
      selectFilterActive: this.props.uiPatients.visibilityFilter !== 'SHOW_ALL'
    });
    this.props.unselectPatient();
  }

  onSearchChange = text => {
    this.props.changeSearchTerm(text);
  };

  toggleSearch = () => {
    this.props.toggleSearchBar();
  };

  toggleFilter = () => {
    this.props.toggleFilterBar();
  };

  toggleSync = () => {
    const { showStatusBar, syncSwitch } = this.props.settings;
    const { updateSettings } = this.props;
    updateSettings({ setting: 'syncSwitch', value: !syncSwitch });
    if (!showStatusBar) {
      updateSettings({ setting: 'showStatusBar', value: true });
      setTimeout(() => {
        updateSettings({ setting: 'showStatusBar', value: false });
      }, 3000);
    }
  };

  onSyncAllUnsynced = () => {
    const { t } = this.props;
    Alert.alert(
      t('deck:confirmSyncAllTitle'),
      t('deck:confirmSyncAllBody'),
      [
        {
          text: t('common:cancel'),
          onPress: () => {
            return null;
          },
          style: 'cancel'
        },
        {
          text: t('common:ok'),
          onPress: () => {
            return this.props.syncAllUnsynced();
          }
        }
      ],
      {
        onDismiss: () => {
          return null;
        }
      }
    );
  };

  updateSearchIndex = selectedSearchIndex => {
    const searchIndex = searchBarButtons[selectedSearchIndex];
    this.props.navigation.setParams({ searchFilterActive: searchIndex !== 'SEARCH_ALL' });
    this.props.changeSearchIndex(searchIndex);
  };

  updateFilterIndex = selectedFilterIndex => {
    const filter = filterBarButtons[selectedFilterIndex];
    this.props.navigation.setParams({ selectFilterActive: filter !== 'SHOW_ALL' });
    this.props.changeFilter(filter);
  };

  renderSearchBar() {
    const { t } = this.props;
    const { showSearchBar, searchFilter } = this.props.uiPatients;
    const searchBarButtonsText = [
      t('deck:searchAll'),
      t('deck:searchId'),
      t('deck:searchName'),
      t('deck:searchBirthday'),
      t('deck:searchDiagnosis'),
      t('deck:searchComments')
    ];

    if (showSearchBar) {
      return (
        <View>
          <ButtonGroup
            onPress={this.updateSearchIndex}
            selectedIndex={searchBarButtons.indexOf(searchFilter) || 0}
            buttons={searchBarButtonsText}
            selectedButtonStyle={styles.selectedButtonStyles}
            selectedTextStyle={styles.searchBarSelectedTextStyles}
            buttonStyle={styles.buttonStyles}
            containerStyle={styles.noBorderContainerStyles}
            textStyle={styles.searchBarTextStyles}
          />
        </View>
      );
    }
  }

  renderFilterBar() {
    const { showFilterBar, visibilityFilter } = this.props.uiPatients;
    const { t } = this.props;
    const filterBarButtonsText = [t('deck:showAll'), t('deck:show30d'), t('deck:show6m'), t('deck:show1y'), t('deck:showStationary')];

    if (showFilterBar) {
      return (
        <View>
          <ButtonGroup
            onPress={this.updateFilterIndex}
            selectedIndex={filterBarButtons.indexOf(visibilityFilter) || 0}
            buttons={filterBarButtonsText}
            selectedButtonStyle={styles.selectedButtonStyles}
            selectedTextStyle={styles.searchBarSelectedTextStyles}
            buttonStyle={styles.buttonStyles}
            containerStyle={styles.noBorderContainerStyles}
            textStyle={styles.searchBarTextStyles}
          />
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.flex1Styles}>
        <View style={styles.containerBarStyles}>
          {this.renderSearchBar()}
          {this.renderFilterBar()}
        </View>

        <PatientList onSearchChange={this.onSearchChange} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flex1Styles: {
    flex: 1
  },
  containerBarStyles: {
    backgroundColor: '#393e42'
  },
  containerStyles: {
    borderWidth: 0
  },
  noBorderContainerStyles: {
    borderWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0
  },
  selectedButtonStyles: {
    backgroundColor: secondaryColor
  },
  searchBarTextStyles: {
    color: 'black'
  },
  searchBarSelectedTextStyles: {
    color: textSecondaryColor
  },
  buttonStyles: {
    backgroundColor: '#bbb'
  },
  headerContainerStyles: {
    height: getHeaderHeight(),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 10,
    shadowOpacity: 10 //remove shadow on iOS
  },
  headerSubContainerStyles: {
    flex: 1,
    backgroundColor: primaryColor,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly'
  },
  headerTitleStyles: {
    flex: 2
  },
  headerTitleTextStyles: {
    fontWeight: 'bold',
    color: textPrimaryColor,
    fontSize: 20
  },
  headerButtonStyles: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1
  },
  extraIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  extraIconContainerStyles: {
    height: Platform.OS === 'ios' ? '60%' : '50%',
    position: 'absolute',
    justifyContent: 'flex-end'
    // TODO: Improve the hack above
  },
  absoluteStyles: {
    position: 'absolute',
    justifyContent: 'center',
    height: '100%',
    zIndex: 1
  },
  iconTextStyles: {
    alignSelf: 'center',
    fontSize: 8,
    fontWeight: 'bold',
    color: textPrimaryColor
  }
});

function mapStateToProps({ uiPatients, syncQueue, settings }) {
  return { uiPatients, syncQueueLength: syncQueue.queue.length, settings };
}

export default withNamespaces(['navigation', 'deck'], { wait: true })(
  connect(
    mapStateToProps,
    actions
  )(DeckScreen)
);
