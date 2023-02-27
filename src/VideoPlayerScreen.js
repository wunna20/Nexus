import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
// import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video'
import Orientation from 'react-native-orientation'

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = ({ route, navigation }) => {

    const { movie } = route.params;

    // useEffect(() => {
    //     Orientation.lockToLandscape()
    // }, [])

    function back() {
        const { goBack } = navigation
        // Orientation.lockToPortrait()
        goBack()
    }

    return (
        <View style={styles.container}>
            {/* <Video 
                    source={{uri: movie.downloadUrl}}
                    onBack={() => back()}
                    title={movie.title}
            /> */}

            <Video
                source={{ uri: movie.downloadUrl }}               
                paused={false}               
                repeat={true}        
                style={styles.mediaPlayer}  
                controls={true}                
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

    mediaPlayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center', 
      },
})