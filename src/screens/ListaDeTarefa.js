import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import styles from '../styles/ListaDeTarefaStyles';
import NavbarBottom from '../components/NavbarBottom';
import { useNavigation } from '@react-navigation/native';

export default function ListaDeTarefa() {
    const [tarefa, setTarefa] = useState('');
    const [tarefas, setTarefas] = useState([]);
    const [statusFilter, setStatusFilter] = useState('todos');
    const [prioridadeFilter, setPrioridadeFilter] = useState('todas');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const carregarTarefas = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'tarefas'));
            const tarefasData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTarefas(tarefasData);
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
            carregarTarefas();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível adicionar a tarefa.');
        }
    };

    const alterarStatus = async (id, statusAtual) => {
        const novosStatus = {
            'pendente': 'em andamento',
            'em andamento': 'concluída',
            'concluída': 'pendente',
        };

        const novoStatus = novosStatus[statusAtual] || 'pendente';

        try {
            const tarefaRef = doc(db, 'tarefas', id);
            await updateDoc(tarefaRef, { status: novoStatus });
            carregarTarefas();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível alterar o status da tarefa.');
        }
    };

    const removerTarefa = async (id) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir esta tarefa?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    onPress: async () => {
                        try {
                            const tarefaRef = doc(db, 'tarefas', id);
                            await deleteDoc(tarefaRef);
                            carregarTarefas();
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível remover a tarefa.');
                        }
                    },
                },
            ]
        );
    };

    const filterTarefas = () => {
        return tarefas.filter((tarefa) => {
            const statusMatch =
                statusFilter === 'todos' || tarefa.status === statusFilter;
            const prioridadeMatch =
                prioridadeFilter === 'todas' || tarefa.prioridade === prioridadeFilter;
            return statusMatch && prioridadeMatch;
        });
    };

    const handleNavigate = (route) => {
        navigation.navigate(route);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Tarefas</Text>

            <TextInput
                style={styles.input}
                placeholder="Adicione uma tarefa"
                value={tarefa}
                onChangeText={setTarefa}
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

            {loading ? (
                <Text>Carregando tarefas...</Text>
            ) : (
                <FlatList
                    data={filterTarefas()}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.itemText}>
                                {item.nome} ({item.status}, {item.prioridade})
                            </Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => alterarStatus(item.id, item.status)}
                            >
                                <Text style={styles.buttonText}>Mudar Status</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removerTarefa(item.id)}
                            >
                                <Text style={styles.removeButtonText}>Remover</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            <NavbarBottom onNavigate={handleNavigate} />
        </View>
    );
}
