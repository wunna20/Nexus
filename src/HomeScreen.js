import { FlatList, StyleSheet, Text, View, Image, Button } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import MovieCard from '../components/MovieCard';
import data from '../data.json'
import Loading from '../components/Loading';
import { virgilCrypto } from 'react-native-virgil-crypto';
import RNFetchBlob from 'rn-fetch-blob'

var RNFS = require('react-native-fs');

const HomeScreen = () => {

    const [movieArr, setMovieArr] = useState(data)
    const [isLoading, setIsLoading] = useState(false)

    const keyPair = virgilCrypto.generateKeys()


    const toastConfig = {
        success: (props) => (
            <BaseToast
                {...props}
                style={{ borderLeftColor: 'brown' }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                    fontSize: 15,
                    fontWeight: '400'
                }}
            />
        )
    };


    const downloadVideo = async (url, id) => {
        try {
            const { config } = RNFetchBlob

            setIsLoading(true)
            config({ fileCache: true, appendExt: 'mp4' })
                .fetch('GET', url)
                .progress((received, total) =>
                    console.log(`Download - received: ${received} / total: ${total}`)
                ) 
                .then(async response => {
                    console.log('response', response)
                    const encryptedFile = await virgilCrypto.encryptFile({
                        inputPath: response.path(),
                        outputPath: `${RNFS.DocumentDirectoryPath}/video.mp4`,
                        publicKeys: keyPair.publicKey
                    })

                    console.log(`encryptedFile ${encryptedFile}`)

                    const decryptedFile = await virgilCrypto.decryptFile({
                        inputPath: encryptedFile,
                        outputPath: undefined,
                        privateKey: keyPair.privateKey
                    })

                    console.log(`decryptedFile ${decryptedFile}`)
                    decryptUrl = `file://${decryptedFile}`

                    const item = { downloadUrl: decryptUrl }
                    const index = movieArr.findIndex(obj => obj.id === id)

                    movieArr[index] = { ...movieArr[index], ...item }
                    const updated = [...movieArr, movieArr[index]]
                    const removeItem = updated.slice(0, -1)
                    setMovieArr(removeItem)
                    await AsyncStorage.setItem('keys', JSON.stringify(removeItem))
                    setIsLoading(false)
                    console.log('finish')

                })
                .catch(err => console.log(`Error ${err}`))
        } catch (error) {
            console.log(error)
        }

        console.log('content', content)
    }

    const removeItem = async (id) => {
        try {
            const result = await AsyncStorage.getItem('keys')
            const movies = JSON.parse(result)
            const index = movies.findIndex(obj => obj.id === id)
            const item = { downloadUrl: null }
            movies[index] = { ...movies[index], ...item }
            console.log('inner delete', movies)
            setMovieArr(movies)
            await AsyncStorage.setItem('keys', JSON.stringify(movies))
        } catch (error) {
            console.log('delete err', error)
        }
    }


    const readMovie = async () => {
        const result = await AsyncStorage.getItem('keys')
        const updateData = JSON.parse(result)

        if (result !== null) {
            setMovieArr(updateData)
        }
        console.log('test res', movieArr)
    }


    useEffect(() => {
        readMovie();
        console.log('res', movieArr)
    }, [])

    return (
        <View style={styles.container}>

            {
                isLoading == true ? (
                    <View>
                        <Loading />
                    </View>
                ) : (
                    null
                )
            }
            <FlatList
                data={movieArr}
                numColumns={2}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <MovieCard movie={item} onDownload={() => downloadVideo(item.videoUrl, item.id)} onDelete={() => removeItem(item.id)} />}
            />
            <Toast config={toastConfig} />


        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
    },
})