import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../config/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import styles from '../styles/ListaDeTarefaStyles';
import NavbarBottom from '../components/NavbarBottom';
import { useNavigation } from '@react-navigation/native';

export default function ListaDeTarefa() {
    const [tarefa, setTarefa] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [prioridadeFilter, setPrioridadeFilter] = useState('todas');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const carregarTarefas = async () => {
        setLoading(true);
        try {
            await getDocs(collection(db, 'tarefas'));
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar as tarefas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarTarefas();
    }, []);

    const adicionarTarefa = async () => {
        if (tarefa.trim() === '') {
            Alert.alert('Erro', 'Por favor, insira uma tarefa.');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Erro', 'Usuário não autenticado');
            return;
        }

        const novaTarefa = {
            nome: tarefa,
            status: 'pendente',
            prioridade: 'baixa',
            dataCriacao: new Date().toISOString(),
            usuarioId: user.uid,
        };

        try {
            await addDoc(collection(db, 'tarefas'), novaTarefa);
            setTarefa('');
            Alert.alert('Sucesso', 'Tarefa adicionada com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível adicionar a tarefa.');
        }
    };

    const handleNavigate = (route) => {
        navigation.navigate(route);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.wrapper}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Adicionar Tarefa</Text>

                        <TextInput
                            style={styles.inputMultiline}
                            placeholder="Descreva a tarefa com mais detalhes..."
                            value={tarefa}
                            onChangeText={setTarefa}
                            multiline
                            numberOfLines={4}
                        />

                        <TouchableOpacity style={styles.button} onPress={adicionarTarefa}>
                            <Text style={styles.buttonText}>Adicionar</Text>
                        </TouchableOpacity>

                        <Text style={styles.filterLabel}>Filtrar por Status:</Text>
                        <Picker
                            selectedValue={statusFilter}
                            onValueChange={(itemValue) => setStatusFilter(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Todos" value="todos" />
                            <Picker.Item label="Pendente" value="pendente" />
                            <Picker.Item label="Em andamento" value="em andamento" />
                            <Picker.Item label="Concluída" value="concluída" />
                        </Picker>

                        <Text style={styles.filterLabel}>Filtrar por Prioridade:</Text>
                        <Picker
                            selectedValue={prioridadeFilter}
                            onValueChange={(itemValue) => setPrioridadeFilter(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Todas" value="todas" />
                            <Picker.Item label="Alta" value="alta" />
                            <Picker.Item label="Média" value="média" />
                            <Picker.Item label="Baixa" value="baixa" />
                        </Picker>

                        {loading ? <Text>Carregando tarefas...</Text> : null}
                    </View>
                </ScrollView>

                <View style={styles.navbar}>
                    <NavbarBottom onNavigate={handleNavigate} />
                </View>
            </View>
        </SafeAreaView>
    );
}
