import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    Pressable,
    Button,
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

    const formatarDataHora = (dataHora) => {
        if (!dataHora) return '';
        if (typeof dataHora.toDate === 'function') {
            return dataHora.toDate().toLocaleString();
        }
        if (dataHora instanceof Date) {
            return dataHora.toLocaleString();
        }
        if (typeof dataHora === 'string') {
            return new Date(dataHora).toLocaleString();
        }
        return '';
    };

    const buscarDados = async () => {
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

            const periodoQuery = query(
                collection(db, 'movimentacoes'),
                where('dataHora', '>=', inicioTimestamp),
                where('dataHora', '<=', fimTimestamp),
                orderBy('dataHora', 'asc')
            );
            const periodoSnapshot = await getDocs(periodoQuery);
            const periodoDados = periodoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setEntradas(periodoDados.filter(item => item.tipo === 'entrada'));
            setSaidas(periodoDados.filter(item => item.tipo === 'saida'));
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', `Erro ao buscar dados: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const exportarExcel = async () => {
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

        const wsEntradas = XLSX.utils.json_to_sheet(dadosEntradas);
        XLSX.utils.book_append_sheet(wb, wsEntradas, 'Entradas');

        const wsSaidas = XLSX.utils.json_to_sheet(dadosSaidas);
        XLSX.utils.book_append_sheet(wb, wsSaidas, 'Saídas');

        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

        const uri = FileSystem.cacheDirectory + 'relatorio_estoque.xlsx';

        try {
            await FileSystem.writeAsStringAsync(uri, wbout, {
                encoding: FileSystem.EncodingType.Base64,
            });
            await Sharing.shareAsync(uri);
        } catch (error) {
            Alert.alert('Erro', `Erro ao exportar arquivo: ${error.message}`);
        }
    };

    const sections = [
        { key: 'entradasTitle', type: 'title', title: 'Entradas' },
        ...entradas.map(item => ({ key: item.id, type: 'entrada', data: item })),
        { key: 'saidasTitle', type: 'title', title: 'Saídas' },
        ...saidas.map(item => ({ key: item.id, type: 'saida', data: item })),
    ];

    const renderItem = useCallback(({ item }) => {
        if (item.type === 'title') {
            return <Text style={[styles.titulo, { marginTop: 20 }]}>{item.title}</Text>;
        }

        const data = item.data;

        return (
            <View style={styles.item}>
                <Text><Text style={styles.negrito}>Data Hora:</Text> {formatarDataHora(data.dataHora)}</Text>
                <Text><Text style={styles.negrito}>Equipamento:</Text> {data.equipamento}</Text>
                <Text><Text style={styles.negrito}>Patrimônio:</Text> {data.patrimonio}</Text>
                <Text><Text style={styles.negrito}>Quantidade:</Text> {data.quantidade}</Text>
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
    }, [entradas, saidas]);

    return (
        <View style={styles.container}>
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                    <Button title="Buscar" onPress={buscarDados} />
                </View>
                <View style={{ flex: 1 }}>
                    <Button title="Exportar Excel" onPress={exportarExcel} disabled={loading} />
                </View>
            </View>

            {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />}

            <FlatList
                data={sections}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                style={{ marginTop: 20 }}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            <NavbarBottom navigation={navigation} />
        </View>
    );
}
