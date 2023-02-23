import React, { useState } from "react";
import { View, Alert, StyleSheet, TouchableOpacity, Text, Button } from 'react-native';
import { Card } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import Loading from "./Loading";


const MovieCard = ({ movie, onDownload, onDelete }) => {

    const navigation = useNavigation();
    const [showBox, setShowBox] = useState(true);

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

    async function getFileSize (fileUri) {
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
                                <Text>Delete</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Card.Title title={movie.title} titleStyle={{ color: "#000" }} />
                    <Card.Actions style={{ marginTop: -10 }}>
                        {movie.downloadUrl != null ? (
                            <View>
                                <Text style={{color: 'black'}}>Success</Text>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => {
                                onDownload(movie)
                            }
                            }>    
                                <Text style={{color: 'black'}}>Download</Text>           
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
    // return (
    //     <View style={styles.container}>
    //         {
    //             movie.downloadUrl != null ? (
    //                 <TouchableOpacity onPress={() => navigation.navigate('VideoPlayer', { movie: movie })}>
    //                     <Card style={styles.card}>
    //                         <View>
    //                             <Card.Cover source={{ uri: movie.videoThumbnail }} style={styles.image} />
    //                             <TouchableOpacity onPress={() => showConfirmDialog()} style={styles.absolute}>
    //                                 <MaterialCommunityIcons name="delete-circle" size={50} color="red" />
    //                             </TouchableOpacity>
    //                         </View>
    //                         <Card.Title title={movie.title} titleStyle={{ color: "#000" }} />
    //                         <Card.Actions style={{ marginBottom: 10, marginTop: -20 }}>
    //                             <TouchableOpacity>
    //                                 <AntDesign name="checkcircle" size={24} color="#000" />
    //                             </TouchableOpacity>
    //                         </Card.Actions>
    //                     </Card>
    //                 </TouchableOpacity>
    //             ) : (
    //                 <TouchableOpacity onPress={showToast}>
    //                     <Card style={styles.card}>
    //                         <Card.Cover source={{ uri: movie.videoThumbnail }} style={styles.image} />
    //                         <Card.Title title={movie.title} titleStyle={{ color: "#ffffff" }} />
    //                         <Card.Actions style={{ marginBottom: 10, marginTop: -20 }}>
    //                             {
    //                                 onDownload ? (
    //                                     <TouchableOpacity onPress={() => onDownload(movie)}>
    //                                         <Loading />
    //                                     </TouchableOpacity>

    //                                 ) : (
    //                                     <TouchableOpacity onPress={() => onDownload(movie)}>
    //                                         <MaterialIcons name="file-download" size={24} color="#ffffff" />
    //                                     </TouchableOpacity>
    //                                 )
    //                             }
    //                         </Card.Actions>
    //                     </Card>
    //                 </TouchableOpacity>
    //             )
    //         }

    //     </View>
    // )
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
    }
})