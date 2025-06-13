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

const DatePickerCampo = ({ label, value, onChange }) => {
    const [mostrar, setMostrar] = useState(false);

    return (
        <View style={styles.datePickerGroup}>
            <Text style={styles.label}>{label}</Text>
            <Pressable onPress={() => setMostrar(true)} style={styles.datePicker}>
                <Text style={{ color: '#000' }}>{value.toLocaleDateString()}</Text>
            </Pressable>
            {mostrar && (
                <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setMostrar(false);
                        if (date) onChange(date);
                    }}
                />
            )}
        </View>
    );
};

export default function RelatorioEstoque({ navigation }) {
    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataFim, setDataFim] = useState(new Date());
    const [entradas, setEntradas] = useState([]);
    const [saidas, setSaidas] = useState([]);
    const [loading, setLoading] = useState(false);

    const formatarDataHora = useCallback((dataHora) => {
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
            Quantidade: item.quantidade || '',
            LocalArmazenamento: item.localArmazenamento || '',
            Unidade: item.unidade || '',
        }));

        const dadosSaidas = saidas.map(item => ({
            DataHora: formatarDataHora(item.dataHora),
            Equipamento: item.equipamento || '',
            Patrimonio: item.patrimonio || '',
            Quantidade: item.quantidade || '',
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
    }, [entradas, saidas, formatarDataHora]);

    const sections = [
        { key: 'entradasTitle', type: 'title', title: 'Entradas' },
        ...entradas.map(item => ({ key: item.id, type: 'entrada', data: item })),
        { key: 'saidasTitle', type: 'title', title: 'Saídas' },
        ...saidas.map(item => ({ key: item.id, type: 'saida', data: item })),
    ];

    const renderItem = useCallback(({ item }) => {
        if (item.type === 'title') {
            const color = item.title === 'Entradas' ? 'blue' : 'red';
            return (
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: color,
                        marginTop: 30,
                        marginBottom: 10,
                        textAlign: 'center',
                        borderBottomWidth: 2,
                        borderBottomColor: color,
                        paddingBottom: 5,
                    }}
                >
                    {item.title}
                </Text>
            );
        }

        const data = item.data;

        return (
            <View style={styles.item}>
                <Text>
                    <Text style={[styles.negrito, { color: '#000' }]}>Data Hora:</Text>{' '}
                    <Text style={{ color: '#000' }}>{formatarDataHora(data.dataHora)}</Text>
                </Text>
                <Text>
                    <Text style={[styles.negrito, { color: '#000' }]}>Equipamento:</Text>{' '}
                    <Text style={{ color: '#000' }}>{data.equipamento || '-'}</Text>
                </Text>
                <Text>
                    <Text style={[styles.negrito, { color: '#000' }]}>Patrimônio:</Text>{' '}
                    <Text style={{ color: '#000' }}>{data.patrimonio || '-'}</Text>
                </Text>
                <Text>
                    <Text style={[styles.negrito, { color: '#000' }]}>Quantidade:</Text>{' '}
                    <Text style={{ color: '#000' }}>{data.quantidade || '-'}</Text>
                </Text>

                {item.type === 'entrada' && (
                    <>
                        <Text style={{ color: 'blue', fontWeight: 'bold' }}>Entrada</Text>
                        <Text>
                            <Text style={[styles.negrito, { color: '#000' }]}>Local Armazenamento:</Text>{' '}
                            <Text style={{ color: '#000' }}>{data.localArmazenamento || '-'}</Text>
                        </Text>
                        <Text>
                            <Text style={[styles.negrito, { color: '#000' }]}>Unidade:</Text>{' '}
                            <Text style={{ color: '#000' }}>{data.unidade || '-'}</Text>
                        </Text>
                    </>
                )}

                {item.type === 'saida' && (
                    <>
                        <Text style={{ color: 'red', fontWeight: 'bold' }}>Saída</Text>
                        <Text>
                            <Text style={[styles.negrito, { color: '#000' }]}>Local Destino:</Text>{' '}
                            <Text style={{ color: '#000' }}>{data.localDestino || '-'}</Text>
                        </Text>
                        <Text>
                            <Text style={[styles.negrito, { color: '#000' }]}>Local Armazenamento:</Text>{' '}
                            <Text style={{ color: '#000' }}>{data.localArmazenamento || '-'}</Text>
                        </Text>
                        <Text>
                            <Text style={[styles.negrito, { color: '#000' }]}>Unidade:</Text>{' '}
                            <Text style={{ color: '#000' }}>{data.unidade || '-'}</Text>
                        </Text>
                    </>
                )}
            </View>
        );
    }, [formatarDataHora]);

    return (
        <View style={styles.container}>
            <Text style={styles.tituloPrincipal}>Relatório de Estoque</Text>

            <View style={styles.datePickerContainer}>
                <DatePickerCampo label="Data Início:" value={dataInicio} onChange={setDataInicio} />
                <DatePickerCampo label="Data Fim:" value={dataFim} onChange={setDataFim} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                    <Button title="Buscar" onPress={buscarDados} disabled={loading} />
                </View>
                <View style={{ flex: 1 }}>
                    <Button
                        title="Exportar Excel"
                        onPress={exportarExcel}
                        disabled={loading || (entradas.length === 0 && saidas.length === 0)}
                    />
                </View>
            </View>

            {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />}

            <FlatList
                data={sections}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                style={{ marginTop: 20 }}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    !loading && (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
                            Nenhum dado para exibir.
                        </Text>
                    )
                }
            />

            <NavbarBottom navigation={navigation} ativo="RelatorioEstoque" />
        </View>
    );
}
