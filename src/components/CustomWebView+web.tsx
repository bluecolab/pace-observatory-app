/**
 * A custom WebView component that loads a given URI. If the URI is not from a specific domain, it opens the link in the default browser.
 * @param uri - The URI (i.e. the URL of website) to load in the WebView.
 * @returns {JSX.Element}
 */
export default function CustomWebViewIframe({ uri }: { uri: string }) {
    return <iframe src={uri} style={{ flex: 1 }} sandbox="allow-scripts allow-same-origin" />;
}
