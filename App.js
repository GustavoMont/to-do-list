import React, { useState, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons'
import {
  StyleSheet, Text, View, SafeAreaView,
  FlatList, StatusBar, TouchableOpacity,
  Modal, TextInput, CheckBox
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import TaskList from './src/components/TaskList';

export default function App() {
  const [tasks, setTasks] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isImportant, setIsImportant] = useState(false)
  const [statusBarColor, setStatusBarColor] = useState('#073b4c')
  
  useEffect(() =>{

    (async () =>{
      const savedTasks = await AsyncStorage.getItem('@tasks')

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    })();

  }, [])

  useEffect(() =>{
    (async () => {
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasks))
    })();

  }, [tasks])


  function handleSubmit(){
    if (inputValue === '' || inputValue.length < 3) {
        alert('Por favor preencha a descrição da tarefa!!')
        return
    }
    const novaTarefa = {id:tasks.length + 1, content: inputValue, priority: isImportant}
    const tarefasAtualizadas = novaTarefa.priority ? [novaTarefa, ...tasks] : [...tasks, novaTarefa]
    setTasks(tarefasAtualizadas)
    setIsVisible(false)
    setIsImportant(false)
    setInputValue('')
  }

  const handleDelete = useCallback((data) =>{
    const uncompleted = tasks.filter((element) => element.id !== data.id)
    uncompleted.forEach((e, i) => e.id = i+1)
    setTimeout(() =>{
      setTasks(uncompleted)
    }, 100)
  })

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={`${statusBarColor}`} />
      <Text style={styles.title}>Suas Tarefas</Text>

      <View>
        <FlatList
          data={tasks}
          renderItem={({ item }) => <TaskList data={item} priority={item.priority} press= {handleDelete}/>}
          keyExtractor={item => item.id}
        />
      </View>

      <Modal animationType="slide" transparent={false} visible={isVisible} >
        <SafeAreaView style={styles.modalArea}>

          <View style={styles.modalHeader}>
            <TouchableOpacity style={{ marginHorizontal: 10 }}>
              <Ionicons name="arrow-back" size={50} onPress={() => { setStatusBarColor('#073b4c') 
              setIsVisible(false)}} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Adicionar Tarefa</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              placeholder="Digite a tarefa que deseja adicionar..."
              style={styles.input}
              autoCorrect={false}
              value={inputValue}
              onChangeText={(texto) => setInputValue(texto)}
            />
            <View style={styles.checkContainer}>
              <CheckBox
                value={isImportant}
                onValueChange={setIsImportant}
                style={styles.formCheckBox}
              />
              <Text style={styles.label}>Adicionar prioridade a tarefas</Text>
            </View>
            <TouchableOpacity style={styles.formBtn} onPress={handleSubmit}>
              <Text style={styles.formBtnTxt}>Adicionar</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>

      </Modal>
      <TouchableOpacity style={styles.add} onPress={() => {
          setStatusBarColor('#12b090')
          setIsVisible(true)}
        }>
        <Ionicons name="ios-add" size={40} color='#ef476f' />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#118ab2',
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 32,
    marginTop: 40,
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  add: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    position: 'absolute',
    bottom: 60,
    right: 40,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalArea: {
    flex: 1,
    backgroundColor: '#06d6a0',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 28
  },
  form: {
    paddingVertical: 20,
  },
  input: {
    backgroundColor: '#fff',
    height: 180,
    paddingTop: 20,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    width: '95%',
    alignSelf: 'center',
    borderRadius: 10
  },
  formBtn: {
    backgroundColor: '#fff',
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 32,
    shadowColor: "#000",
    borderRadius: 8,
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 9.84,
    elevation: 10,
  },
  formBtnTxt: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    padding: 10,
  },
  formCheckBox: {
    marginRight: 8,
  },
  label: {
    color: '#fff',
    fontFamily: 'sans-serif',
    fontSize: 18,
    fontWeight: '700',

  }
});
