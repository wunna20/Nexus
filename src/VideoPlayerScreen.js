import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation'


const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = ({ route, navigation }) => {

    const { movie } = route.params;

    // useEffect(() => {
    //     Orientation.lockToLandscape()
    // }, [])

    function back () {
        const {goBack} = navigation
        // Orientation.lockToPortrait()
        goBack()
    }

    return (
        <View style={styles.container}>
            <VideoPlayer 
                    source={{uri: movie.downloadUrl}}
                    onBack={() => back()}
                    title={movie.title}
                />
        </View>
    )
}

export default VideoPlayerScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },

    video: {
        width: width,
        height: height / 3,
        marginBottom: 30
    },
})