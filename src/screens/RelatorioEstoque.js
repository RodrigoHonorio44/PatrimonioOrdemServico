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
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
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
    const [estoqueAtual, setEstoqueAtual] = useState([]);
    const [loading, setLoading] = useState(false);

    const formatarDataHora = (dataHora) => {
        if (!dataHora) return '';
        let dateObj = null;
        if (typeof dataHora.toDate === 'function') {
            dateObj = dataHora.toDate();
        } else if (typeof dataHora === 'string') {
            dateObj = new Date(dataHora);
        } else if (dataHora instanceof Date) {
            dateObj = dataHora;
        } else {
            return '';
        }
        return dateObj.toLocaleString();
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
                where('dataHora', '<=', fimTimestamp)
            );
            const periodoSnapshot = await getDocs(periodoQuery);
            const periodoDados = periodoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const entradasData = periodoDados.filter(item => item.tipo === 'entrada');
            const saidasData = periodoDados.filter(item => item.tipo === 'saida');
            setEntradas(entradasData);
            setSaidas(saidasData);

            const todasSnapshot = await getDocs(collection(db, 'movimentacoes'));
            const todasMovimentacoes = todasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const estoqueMap = {};
            todasMovimentacoes.forEach(item => {
                const key = `${item.equipamento}||${item.patrimonio}||${item.unidade || ''}`;
                if (!estoqueMap[key]) {
                    estoqueMap[key] = {
                        equipamento: item.equipamento,
                        patrimonio: item.patrimonio,
                        unidade: item.unidade || '',
                        quantidade: 0,
                    };
                }
                const quantidade = Number(item.quantidade) || 0;
                if (item.tipo === 'entrada') estoqueMap[key].quantidade += quantidade;
                else if (item.tipo === 'saida') estoqueMap[key].quantidade -= quantidade;
            });

            const estoqueArray = Object.values(estoqueMap).filter(item => item.quantidade > 0);
            setEstoqueAtual(estoqueArray);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', `Erro ao buscar dados: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const gerarExcel = async () => {
        if (entradas.length === 0 && saidas.length === 0 && estoqueAtual.length === 0) {
            Alert.alert('Atenção', 'Nenhum dado disponível para exportar.');
            return;
        }

        try {
            const wsEntradaData = entradas.map(item => [
                formatarDataHora(item.dataHora),
                item.equipamento || '',
                item.patrimonio || '',
                item.quantidade || '',
                item.localArmazenamento || '',
                item.tipo || '',
                item.unidade || '',
            ]);
            const wsEntrada = XLSX.utils.aoa_to_sheet([
                ['Data Hora', 'Equipamento', 'Patrimônio', 'Quantidade', 'Local Armazenamento', 'Tipo', 'Unidade'],
                ...wsEntradaData,
            ]);

            const wsSaidaData = saidas.map(item => [
                formatarDataHora(item.dataHora),
                item.equipamento || '',
                item.patrimonio || '',
                item.localDestino || '',
                item.quantidade || '',
                item.localArmazenamento || '',
                item.tipo || '',
                item.unidade || '',
            ]);
            const wsSaida = XLSX.utils.aoa_to_sheet([
                ['Data Hora', 'Equipamento', 'Patrimônio', 'Local Destino', 'Quantidade', 'Local Armazenamento', 'Tipo', 'Unidade'],
                ...wsSaidaData,
            ]);

            const wsEstoqueData = estoqueAtual.map(item => [
                item.equipamento || '',
                item.patrimonio || '',
                item.quantidade || 0,
                item.unidade || '',
            ]);
            const wsEstoque = XLSX.utils.aoa_to_sheet([
                ['Equipamento', 'Patrimônio', 'Quantidade', 'Unidade'],
                ...wsEstoqueData,
            ]);

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, wsEntrada, 'Entradas');
            XLSX.utils.book_append_sheet(workbook, wsSaida, 'Saídas');
            XLSX.utils.book_append_sheet(workbook, wsEstoque, 'Estoque Atual');

            const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
            const uri = FileSystem.cacheDirectory + 'relatorio_estoque.xlsx';

            await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
            await Sharing.shareAsync(uri);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao gerar ou compartilhar o arquivo Excel.');
            console.error(error);
        }
    };

    // Para renderizar itens e títulos das seções no FlatList principal
    const sections = [
        { key: 'entradasTitle', type: 'title', title: 'Entradas' },
        ...entradas.map(item => ({ key: item.id, type: 'entrada', data: item })),
        { key: 'saidasTitle', type: 'title', title: 'Saídas' },
        ...saidas.map(item => ({ key: item.id, type: 'saida', data: item })),
        { key: 'estoqueTitle', type: 'title', title: 'Estoque Atual' },
        ...estoqueAtual.map((item, index) => ({ key: `estoque_${index}`, type: 'estoque', data: item })),
    ];

    const renderItem = useCallback(({ item }) => {
        if (item.type === 'title') {
            return <Text style={[styles.titulo, { marginTop: 20 }]}>{item.title}</Text>;
        }

        const data = item.data;
        if (item.type === 'entrada') {
            return (
                <View style={styles.item}>
                    <Text><Text style={styles.negrito}>Data Hora:</Text> {formatarDataHora(data.dataHora)}</Text>
                    <Text><Text style={styles.negrito}>Equipamento:</Text> {data.equipamento}</Text>
                    <Text><Text style={styles.negrito}>Patrimônio:</Text> {data.patrimonio}</Text>
                    <Text><Text style={styles.negrito}>Quantidade:</Text> {data.quantidade}</Text>
                    <Text><Text style={styles.negrito}>Local Armazenamento:</Text> {data.localArmazenamento || '-'}</Text>
                    <Text><Text style={styles.negrito}>Unidade:</Text> {data.unidade || '-'}</Text>
                </View>
            );
        }
        if (item.type === 'saida') {
            return (
                <View style={styles.item}>
                    <Text><Text style={styles.negrito}>Data Hora:</Text> {formatarDataHora(data.dataHora)}</Text>
                    <Text><Text style={styles.negrito}>Equipamento:</Text> {data.equipamento}</Text>
                    <Text><Text style={styles.negrito}>Patrimônio:</Text> {data.patrimonio}</Text>
                    <Text><Text style={styles.negrito}>Quantidade:</Text> {data.quantidade}</Text>
                    <Text><Text style={styles.negrito}>Local Destino:</Text> {data.localDestino || '-'}</Text>
                    <Text><Text style={styles.negrito}>Local Armazenamento:</Text> {data.localArmazenamento || '-'}</Text>
                    <Text><Text style={styles.negrito}>Unidade:</Text> {data.unidade || '-'}</Text>
                </View>
            );
        }
        if (item.type === 'estoque') {
            return (
                <View style={styles.item}>
                    <Text><Text style={styles.negrito}>Equipamento:</Text> {data.equipamento}</Text>
                    <Text><Text style={styles.negrito}>Patrimônio:</Text> {data.patrimonio}</Text>
                    <Text><Text style={styles.negrito}>Quantidade:</Text> {data.quantidade}</Text>
                    <Text><Text style={styles.negrito}>Unidade:</Text> {data.unidade || '-'}</Text>
                </View>
            );
        }
        return null;
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.datePickerContainer}>
                <View>
                    <Text>Data Início:</Text>
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
                <View>
                    <Text>Data Fim:</Text>
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

            <View style={styles.buttonContainer}>
                <Button title="Buscar" onPress={buscarDados} />
                <Button title="Gerar Excel" onPress={gerarExcel} />
            </View>

            {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

            {!loading && (
                <FlatList
                    data={sections}
                    keyExtractor={item => item.key}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}

            <NavbarBottom navigation={navigation} />
        </View>
    );
}
