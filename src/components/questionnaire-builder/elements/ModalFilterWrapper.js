import React, { Component } from 'react';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { getTypedIonIcon } from '../../../utils/getPlatformIcons';
import { bootstrap, BORDER_COLOR } from '../../../styles/bootstrap';

class ModalPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            options: [],
            error: false,
        };
        this.filteredOptions = null;
        this.value = this.props.value;
    }

    setNativeProps = () => {
        this.setState({ error: true });
        this.forceUpdate();
    };

    focus = () => {
        this._sleep(800).then(() => {
            this.setState({ visible: true });
        });
    };

    _sleep = time => {
        return new Promise(resolve => setTimeout(resolve, time));
    };

    onShow = () => {
        this.setState({ visible: true });
    };

    onCancel = () => {
        this.setState({
            visible: false,
            text: '',
        });
    };

    onSelect = picked => {
        this.setState({
            visible: false,
        });
        if (this.state.error) {
            this.setState({ error: false });
        }
        let { nextRef } = this.props;
        nextRef = nextRef();
        if (nextRef !== undefined && nextRef.value === '') {
            nextRef.focus();
        }

        if (this.filteredOptions[picked] !== undefined) {
            this.value = {
                value: this.filteredOptions[picked].label,
                index: picked,
            };
            this.props.onSelect(this.filteredOptions[picked].label);
        }
    };

    renderPickedValue = value => {
        return value !== '' ? value : ' ....';
    };

    renderOption = rowData => {
        const {
            selectedOption,
            renderOption,
            optionTextStyle,
            selectedOptionTextStyle,
        } = this.props;

        const { key, label, subLabel, dataString, base64String } = rowData;
        let style = styles.optionStyle;
        let textStyle = optionTextStyle || styles.optionTextStyle;

        if (key === selectedOption) {
            style = styles.selectedOptionStyle;
            textStyle =
                selectedOptionTextStyle || styles.selectedOptionTextStyle;
        }

        if (renderOption) {
            return renderOption(rowData, key === selectedOption);
        } else {
            return (
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={style}
                    onPress={() => this.onSelect(key)}
                >
                    <Grid>
                        <Col>
                            <Image
                                style={styles.imageStyles}
                                source={{ uri: base64String }}
                                resizeMode="contain"
                            />
                        </Col>
                        <Col>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Text style={textStyle}>{label}</Text>
                                <Text style={textStyle}>{subLabel}</Text>
                            </View>
                        </Col>
                    </Grid>
                </TouchableOpacity>
            );
        }
    };

    render() {
        const { options, customerRenderer, filteredBy } = this.props;
        this.filteredOptions = options;
        if (filteredBy !== null) {
            var result = [];
            this.filteredOptions
                .filter(v => {
                    var splitted = v.filterKey.split(' ');
                    var filteredByParts = filteredBy.split(' ');

                    let doFilter = false;
                    splitted.forEach(function(term1) {
                        filteredByParts.forEach(function(term2) {
                            if (term1 === term2) {
                                doFilter = true;
                            }
                        });
                    });

                    return doFilter;
                })
                .map(entry => {
                    result[entry.key] = entry;
                });
            this.filteredOptions = result;
        }
        return (
            <View>
                <TouchableOpacity onPress={this.onShow}>
                    <View
                        style={
                            this.state.error
                                ? bootstrap.modalFilterPicker.error
                                : bootstrap.modalFilterPicker.normal
                        }
                    >
                        <Grid style={styles.grid}>
                            <Col size={95}>
                                <Text>
                                    {this.props.label}:{' '}
                                    {this.renderPickedValue(this.props.value)}
                                </Text>
                            </Col>
                            <Col size={5}>
                                <Icon
                                    size={20}
                                    name={getTypedIonIcon('arrow-down')}
                                    type="ionicon"
                                    color={BORDER_COLOR}
                                    onPress={this.onAddFracture}
                                />
                            </Col>
                        </Grid>
                    </View>
                </TouchableOpacity>
                <ModalFilterPicker
                    {...this.props}
                    renderOption={customerRenderer ? this.renderOption : null}
                    visible={this.state.visible}
                    onSelect={this.onSelect}
                    onCancel={this.onCancel}
                    options={this.filteredOptions}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    grid: {
        marginTop: Platform.select({ ios: 0, android: 7 }),
    },
    listElement: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
    },
    container: {
        paddingVertical: 8,
        borderRadius: 0,
        justifyContent: 'center',
    },
    imageStyles: {
        width: 120,
        height: 100,
    },
});

ModalPicker.defaultProps = {
    options: [
        {
            key: '0',
            label: 'default',
            customerRenderer: false,
        },
    ],
};

export default ModalPicker;
