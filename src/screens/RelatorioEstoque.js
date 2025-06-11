import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    Pressable,
    Alert,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import NavbarBottom from '../components/NavbarBottom';
import styles from '../styles/RelatorioEstoqueStyles';

export default function RelatorioEstoque({ navigation }) {
    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataFim, setDataFim] = useState(new Date());
    const [mostrarInicio, setMostrarInicio] = useState(false);
    const [mostrarFim, setMostrarFim] = useState(false);
    const [entradas, setEntradas] = useState([]);
    const [saidas, setSaidas] = useState([]);
    const [loading, setLoading] = useState(false);

    const formatarDataHora = useCallback((dataHora) => {
        if (!dataHora) return '';
        if (typeof dataHora.toDate === 'function') return dataHora.toDate().toLocaleString();
        if (dataHora instanceof Date) return dataHora.toLocaleString();
        if (typeof dataHora === 'string') return new Date(dataHora).toLocaleString();
        return '';
    }, []);

    const buscarDados = useCallback(async () => {
        if (dataInicio > dataFim) {
            Alert.alert('Erro', 'Data Início não pode ser maior que Data Fim.');
            return;
        }

        setLoading(true);
        try {
            const inicio = new Date(dataInicio);
            inicio.setHours(0, 0, 0, 0);

            const fim = new Date(dataFim);
            fim.setHours(23, 59, 59, 999);

            const inicioTimestamp = Timestamp.fromDate(inicio);
            const fimTimestamp = Timestamp.fromDate(fim);

            const dadosQuery = query(
                collection(db, 'movimentacoes'),
                where('dataHora', '>=', inicioTimestamp),
                where('dataHora', '<=', fimTimestamp),
                orderBy('dataHora', 'asc')
            );

            const snapshot = await getDocs(dadosQuery);
            const resultados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setEntradas(resultados.filter(item => item.tipo === 'entrada'));
            setSaidas(resultados.filter(item => item.tipo === 'saida'));
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', `Erro ao buscar dados: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [dataInicio, dataFim]);

    const exportarExcel = useCallback(async () => {
        if (entradas.length === 0 && saidas.length === 0) {
            Alert.alert('Aviso', 'Nenhum dado para exportar.');
            return;
        }

        const dadosEntradas = entradas.map(item => ({
            DataHora: formatarDataHora(item.dataHora),
            Equipamento: item.equipamento || '',
            Patrimonio: item.patrimonio || '',
            Quantidade: item.quantidade,
            LocalArmazenamento: item.localArmazenamento || '',
            Unidade: item.unidade || '',
        }));

        const dadosSaidas = saidas.map(item => ({
            DataHora: formatarDataHora(item.dataHora),
            Equipamento: item.equipamento || '',
            Patrimonio: item.patrimonio || '',
            Quantidade: item.quantidade,
            LocalDestino: item.localDestino || '',
            LocalArmazenamento: item.localArmazenamento || '',
            Unidade: item.unidade || '',
        }));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dadosEntradas), 'Entradas');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dadosSaidas), 'Saídas');

        const uri = FileSystem.cacheDirectory + 'relatorio_estoque.xlsx';
        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

        try {
            await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
            await Sharing.shareAsync(uri);
        } catch (error) {
            Alert.alert('Erro', `Erro ao exportar arquivo: ${error.message}`);
        }
    }, [entradas, saidas, formatarDataHora]);

    const sections = useMemo(() => ([
        { key: 'entradasTitle', type: 'title', title: 'Entradas' },
        ...entradas.map(item => ({ key: item.id, type: 'entrada', data: item })),
        { key: 'saidasTitle', type: 'title', title: 'Saídas' },
        ...saidas.map(item => ({ key: item.id, type: 'saida', data: item })),
    ]), [entradas, saidas]);

    const renderItem = useCallback(({ item }) => {
        if (item.type === 'title') {
            return <Text style={[styles.titulo, { marginTop: 20 }]}>{item.title}</Text>;
        }

        const data = item.data;
        return (
            <View style={styles.item}>
                <Text><Text style={styles.negrito}>Data Hora:</Text> {formatarDataHora(data.dataHora)}</Text>
                <Text><Text style={styles.negrito}>Equipamento:</Text> {data.equipamento || '-'}</Text>
                <Text><Text style={styles.negrito}>Patrimônio:</Text> {data.patrimonio || '-'}</Text>
                <Text><Text style={styles.negrito}>Quantidade:</Text> {data.quantidade || '-'}</Text>
                {item.type === 'entrada' && (
                    <>
                        <Text><Text style={styles.negrito}>Local Armazenamento:</Text> {data.localArmazenamento || '-'}</Text>
                        <Text><Text style={styles.negrito}>Unidade:</Text> {data.unidade || '-'}</Text>
                    </>
                )}
                {item.type === 'saida' && (
                    <>
                        <Text><Text style={styles.negrito}>Local Destino:</Text> {data.localDestino || '-'}</Text>
                        <Text><Text style={styles.negrito}>Local Armazenamento:</Text> {data.localArmazenamento || '-'}</Text>
                        <Text><Text style={styles.negrito}>Unidade:</Text> {data.unidade || '-'}</Text>
                    </>
                )}
            </View>
        );
    }, [formatarDataHora]);

    return (
        <View style={styles.container}>
            <Text style={styles.tituloPrincipal}>Relatório de Estoque</Text>

            <View style={styles.datePickerContainer}>
                <View style={styles.datePickerGroup}>
                    <Text style={styles.label}>Data Início:</Text>
                    <Pressable onPress={() => setMostrarInicio(true)} style={styles.datePicker}>
                        <Text>{dataInicio.toLocaleDateString()}</Text>
                    </Pressable>
                    {mostrarInicio && (
                        <DateTimePicker
                            value={dataInicio}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setMostrarInicio(false);
                                if (date) setDataInicio(date);
                            }}
                        />
                    )}
                </View>

                <View style={styles.datePickerGroup}>
                    <Text style={styles.label}>Data Fim:</Text>
                    <Pressable onPress={() => setMostrarFim(true)} style={styles.datePicker}>
                        <Text>{dataFim.toLocaleDateString()}</Text>
                    </Pressable>
                    {mostrarFim && (
                        <DateTimePicker
                            value={dataFim}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setMostrarFim(false);
                                if (date) setDataFim(date);
                            }}
                        />
                    )}
                </View>
            </View>

            <View style={styles.botoesContainer}>
                <Pressable onPress={buscarDados} style={styles.botao} disabled={loading}>
                    <Text style={styles.botaoTexto}>Buscar</Text>
                </Pressable>
                <Pressable onPress={exportarExcel} style={styles.botao} disabled={loading}>
                    <Text style={styles.botaoTexto}>Exportar Excel</Text>
                </Pressable>
            </View>

            {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />}

            <FlatList
                data={sections}
                renderItem={renderItem}
                keyExtractor={item => item.key}
                contentContainerStyle={{ paddingBottom: 100, marginTop: 20 }}
            />

            <NavbarBottom navigation={navigation} />
        </View>
    );
}
