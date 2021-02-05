import React, { Component } from 'react';
import { View, TouchableHighlight, Image, StyleSheet } from 'react-native';
import { Button, Icon, Card, Divider, Text } from 'react-native-elements';
import { Constants, ImagePicker, Permissions } from 'expo';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import * as actions from '../actions';
import CardHeader from './common/CardHeader';
import InputModal from './InputModal';
import { getTypedIonIcon } from '../utils/getPlatformIcons';
import buttonStyles from '../styles/buttonStyles';
const { primaryColor, secondaryColor } = Constants.manifest.extra;

class AttachmentGallery extends Component {
  state = {
    showModal: false,
    selectedAttachment: null,
    modalType: null
  };

  onDisplayImage(selectedAttachment) {
    this.setState({ showModal: true, modalType: 'view', selectedAttachment });
  }

  onModalClose = () => {
    this.setState({ showModal: false });
  };

  onRemoveAttachment = () => {
    this.props.removeAttachment(this.state.selectedAttachment);
    this.onModalClose();
  };

  onDescriptionChange = text => {
    this.setState({ description: text });
  };

  onAddAttachment = description => {
    this.props.upsertEntity(
      {
        patient: this.props.data.id,
        uri: this.state.selectedAttachment.uri,
        description
      },
      'Attachment'
    );
    this.onModalClose();
  };

  onAddImagePress = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      // alert('Access to camera roll permission not granted...');
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: 'All',
      quality: 1
      //aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({
        showModal: true,
        modalType: 'create',
        selectedAttachment: {
          uri: result.uri
        }
      });
    }
  };

  selectThumbnail = uri => {
    this.setState({ selectedThumbnail: uri });
  };

  renderThumbnails() {
    const { attachments } = this.props.data;
    if (attachments.length) {
      const gallery = attachments.map(item => {
        return (
          <TouchableHighlight
            key={item.uri}
            style={styles.thumbnailWrapperStyles}
            onPress={() => {
              return this.onDisplayImage(item);
            }}
            activeOpacity={0.8}
            underlayColor="white"
          >
            <Image resizeMode="cover" source={{ uri: item.uri }} style={styles.galleryItemStyles} />
          </TouchableHighlight>
        );
      });
      gallery.push(
        <View key="plus" style={styles.thumbnailWrapperStyles}>
          <Icon
            reverse
            size={56}
            name={getTypedIonIcon('add')}
            type="ionicon"
            color={secondaryColor}
            onPress={() => {
              return this.onAddImagePress();
            }}
            containerStyle={[styles.galleryItemStyles, styles.addThumbnailButtonStyles]}
          />
        </View>
      );
      //return Platform.OS === 'android' ? deck : deck.reverse();
      return gallery;
    }
    return (
      <Button
        title={this.props.t('patient:noAttachments')}
        containerStyle={buttonStyles.containerStyles}
        buttonStyle={buttonStyles.buttonStyles}
        titleStyle={buttonStyles.buttonTextStyles}
        onPress={this.onAddImagePress}
      />
    );
  }

  render() {
    const { t, title } = this.props;
    const { showModal, modalType, selectedAttachment } = this.state;
    const { description: text } = selectedAttachment || {};
    return (
      <Card title={<CardHeader title={title} color={primaryColor} onPress={this.onAddImagePress} />}>
        <View style={styles.attachmentsContainerStyles}>
          <View style={styles.galleryContainerStyles}>{this.renderThumbnails()}</View>

          <InputModal
            visible={showModal}
            onModalClose={this.onModalClose}
            modalType={modalType}
            title={modalType === 'create' ? t('patient:addAttachment') : t('patient:viewAttachment')}
            body={{ text }}
            placeholder={t('patient:descriptionPlaceholder')}
            image={selectedAttachment}
            onConfirm={this.onAddAttachment}
            onRemove={this.onRemoveAttachment}
          />
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  attachmentsContainerStyles: {
    flex: 1
  },
  galleryContainerStyles: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  thumbnailWrapperStyles: {
    width: '33%',
    padding: 2,
    aspectRatio: 1
  },
  addAttachmentsWrapperStyles: {
    position: 'absolute',
    right: -15,
    top: -60
  },
  galleryItemStyles: {
    width: '100%',
    height: '100%'
  },
  addThumbnailButtonStyles: {
    borderRadius: 0,
    margin: 0,
    borderWidth: 0,
    padding: 0
  }
});

export default withNamespaces(['patient'], { wait: true })(
  connect(
    null,
    actions
  )(AttachmentGallery)
);
