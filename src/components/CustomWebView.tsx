// component/CustomWebView.tsx
import { useRef } from 'react';
import { Linking } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
/** Handles navigation events in the WebView. If the URL is from a specific domain, it allows the WebView to load it.
 *  Otherwise, it opens the link in the default browser.
 * @param event - The event object containing the URL to be handled.
 * @returns {boolean} - Returns true if the URL is from a specific domain, otherwise false.
 */
const handleNavigation = (event: WebViewNavigation) => {
    // TODO: Use regex to check if the URL is from a specific domain
    const { url } = event;
    const allowedDomains = ['pace.edu'];
    const urlDomain = new URL(url).hostname;
    if (allowedDomains.some((domain) => urlDomain.endsWith(domain))) {
        return true;
    } else {
        void Linking.openURL(url);
        return false;
    }
};

/**
 * A custom WebView component that loads a given URI. If the URI is not from a specific domain, it opens the link in the default browser.
 * @param uri - The URI (i.e. the URL of website) to load in the WebView.
 * @returns {JSX.Element}
 */
export default function CustomWebView({ uri }: { uri: string }) {
    const webviewRef = useRef(null);

    return (
        <WebView
            ref={webviewRef}
            source={{ uri }}
            onShouldStartLoadWithRequest={handleNavigation}
        />
    );
}
