import React from 'react';
import { WebView } from 'react-native-webview';
// import { W } from "@react-navigation/web";

const NewsView = (props) => {
    return ( 
    <WebView cacheMode='LOAD_CACHE_ELSE_NETWORK' source={{uri: props.route.params.uri}} />
    );
}
 
export default NewsView;