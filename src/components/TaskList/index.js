import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons'

export default function TaskList(props) {
    const [iconProps, setIconProps] = useState({name: 'ellipse-outline', color: '#ef476f'})
    const iconTransform = () => setIconProps({name:'checkmark-circle', color:'#06d6a0'})

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() =>{
                iconTransform()
                return props.press(props.data)
            }}>
                <Ionicons name={`${iconProps.name}`} size={25} color={iconProps.color} />
            </TouchableOpacity>
            <Text style={styles.taskDesc}>{props.data.content.toString()}</Text>
            {props.priority ? <Ionicons name="star" style={styles.star} /> : <></>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskDesc: {
        textTransform: 'capitalize',
        color: '#073b4c',
        width: '80%',
    },
    star: {
        color: '#ffd166',
        fontSize: 20,
        position: 'absolute',
        right: 20,
    }
})

