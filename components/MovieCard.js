import React, { useState, useEffect } from "react";
import { View, Alert, StyleSheet, TouchableOpacity, Text, Button, Image } from 'react-native';
import { Card } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import Loading from "./Loading";


const MovieCard = ({ movie, onDownload, onDelete }) => {

    const navigation = useNavigation();
    const [showSize, setShowSize] = useState()

    useEffect(() => {
        fetch(movie.videoUrl, {
            method: 'HEAD'
        }).then(response => {
            console.log('res', response);
            const sizeInBytes = response.headers.get('content-length');
            const sizeInMb = sizeInBytes / (1024 * 1024);
            setShowSize(sizeInMb.toFixed(2));
        })
    }, [movie.videoUrl])

    const cardOnPress = () => {
        if (movie.downloadUrl != null) {
            navigation.navigate('VideoPlayer', { movie: movie })
        } else {
            showToast()
        }
    }

    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Video is not downloaded',
        });
    }

    async function getFileSize(fileUri) {
        let fileInfo = await FileSystem.getInfoAsync(fileUri);
        console.log('file', fileInfo.size)
        return fileInfo.size;
    };

    const showConfirmDialog = () => {
        return Alert.alert(
            "Delete Video?",
            `${movie.title} video will be deleted from download`,
            [
                {
                    text: "Yes",
                    onPress: () => { onDelete() },
                },

                {
                    text: "No",
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <TouchableOpacity onPress={cardOnPress} style={styles.cardLayout}>
                    <View>
                        <Card.Cover source={{ uri: movie.videoThumbnail }} style={styles.image} />
                        {movie.downloadUrl != null && (
                            <TouchableOpacity onPress={() => showConfirmDialog()} style={styles.absolute}>
                                <Image source={{ uri: 'https://www.seekpng.com/png/detail/202-2022743_edit-delete-icon-png-download-delete-icon-png.png' }} style={{ width: 30, height: 30 }} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Card.Title title={movie.title} titleStyle={{ color: "#000" }} />
                    <Card.Actions style={{ marginTop: -10 }}>
                        <View style={styles.textAbsolute}>  
                            <Text style={{ color: 'black' }}>{showSize} MB</Text>
                        </View>
                        {movie.downloadUrl != null ? (
                            <View>
                                <Image source={{ uri: 'https://www.pngitem.com/pimgs/m/347-3479160_detail-check-comments-check-mark-in-circle-icon.png' }} style={{ width: 30, height: 30 }} />
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => {
                                onDownload(movie)
                            }
                            }>
                                <Image source={{ uri: 'https://static.vecteezy.com/system/resources/previews/001/187/075/non_2x/download-png.png' }} style={{ width: 30, height: 30 }} />

                            </TouchableOpacity>
                        )}
                    </Card.Actions>
                </TouchableOpacity>

                {/* {
                    movie.downloadUrl != null && (
                        <View style={styles.loadingLayout}>
                            <Loading />
                            <Text style={styles.loadingText}>Downloading... </Text>
                        </View>
                    )
                } */}

            </Card>
        </View>
    )
}

export default MovieCard


const styles = StyleSheet.create({
    container: {
        width: "45%",
        margin: 10,
    },

    card: {
        width: "100%",
        // padding: 10,
        overflow: "hidden",
        backgroundColor: '#eee'
    },

    loadingLayout: {
        position: 'absolute',
        backgroundColor: "rgba(0,0,0,0.5)",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },

    loadingText: {
        color: "white",
        marginTop: 5,
    },

    cardLayout: {
        padding: 10,
    },

    image: {
        backgroundColor: '#555',
        position: 'relative',
    },

    absolute: {
        position: 'absolute',
        right: 10,
        top: 10
    },

    loading: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: -40
    },

    textAbsolute: {
        marginLeft: 0,
        left: 15,
        position: 'absolute'
    }
})