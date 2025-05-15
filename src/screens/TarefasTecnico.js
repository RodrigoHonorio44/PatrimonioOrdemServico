import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import styles from '../styles/TarefasTecnico.Styles';
import NavbarBottom from '../components/NavbarBottom';
import { useNavigation } from '@react-navigation/native';

export default function TarefasTecnico() {
    const [tarefas, setTarefas] = useState([]);
    const navigation = useNavigation();

    const handleNavigate = (screen) => {
        navigation.navigate(screen);
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'tarefas'), (snapshot) => {
            const dados = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTarefas(dados);
        });

        return () => unsubscribe();
    }, []);

    const alterarStatus = async (tarefaId, statusAtual) => {
        const proximosStatus = {
            'pendente': 'em andamento',
            'em andamento': 'concluída',
            'concluída': 'pendente'
        };

        const novoStatus = proximosStatus[statusAtual] || 'pendente';

        try {
            const ref = doc(db, 'tarefas', tarefaId);
            await updateDoc(ref, { status: novoStatus });
            Alert.alert('Sucesso', 'Status da tarefa atualizado.');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar o status.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Tarefas do Técnico</Text>

            <FlatList
                data={tarefas}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.vazio}>Nenhuma tarefa disponível.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.nome}>Tarefa: {item.nome}</Text>
                        <Text>Status: {item.status}</Text>
                        <Text>Prioridade: {item.prioridade}</Text>
                        <Text>Criada em: {item.dataCriacao}</Text>

                        <TouchableOpacity
                            style={styles.botao}
                            onPress={() => alterarStatus(item.id, item.status)}
                        >
                            <Text style={styles.botaoTexto}>Mudar Status</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <NavbarBottom onNavigate={handleNavigate} />
        </View>
    );
}
