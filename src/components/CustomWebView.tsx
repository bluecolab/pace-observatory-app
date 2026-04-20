import { Platform } from 'react-native';

let CustomWebView: any;

if (Platform.OS === 'web') {
    CustomWebView = require('./CustomWebView.web').default;
} else {
    CustomWebView = require('./CustomWebView.native').default;
}

export default CustomWebView;
