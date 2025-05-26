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
    const [estoqueAtual, setEstoqueAtual] = useState([]);
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

            // Query para filtrar movimentações pelo campo 'dataHora' no intervalo e ordenar pela dataHora ascendente
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

            // Para calcular estoque atual, buscamos todas movimentações (sem filtro de data)
            const todasSnapshot = await getDocs(collection(db, 'movimentacoes'));
            const todasMovimentacoes = todasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const estoqueMap = {};
            todasMovimentacoes.forEach(item => {
                const key = `${item.equipamento || ''}||${item.patrimonio || ''}||${item.unidade || ''}`;
                if (!estoqueMap[key]) {
                    estoqueMap[key] = {
                        equipamento: item.equipamento || '',
                        patrimonio: item.patrimonio || '',
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

    const exportarExcel = async () => {
        const dadosExcel = [];

        entradas.forEach(item => {
            dadosExcel.push({
                Tipo: 'Entrada',
                DataHora: formatarDataHora(item.dataHora),
                Equipamento: item.equipamento || '',
                Patrimonio: item.patrimonio || '',
                Quantidade: item.quantidade,
                LocalArmazenamento: item.localArmazenamento || '',
                Unidade: item.unidade || '',
            });
        });

        saidas.forEach(item => {
            dadosExcel.push({
                Tipo: 'Saida',
                DataHora: formatarDataHora(item.dataHora),
                Equipamento: item.equipamento || '',
                Patrimonio: item.patrimonio || '',
                Quantidade: item.quantidade,
                LocalDestino: item.localDestino || '',
                LocalArmazenamento: item.localArmazenamento || '',
                Unidade: item.unidade || '',
            });
        });

        estoqueAtual.forEach(item => {
            dadosExcel.push({
                Tipo: 'Estoque Atual',
                Equipamento: item.equipamento || '',
                Patrimonio: item.patrimonio || '',
                Quantidade: item.quantidade,
                Unidade: item.unidade || '',
            });
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dadosExcel);
        XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
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
        { key: 'estoqueTitle', type: 'title', title: 'Estoque Atual' },
        ...estoqueAtual.map((item, index) => ({ key: `estoque_${index}`, type: 'estoque', data: item })),
    ];

    const renderItem = useCallback(({ item }) => {
        if (item.type === 'title') {
            return <Text style={[styles.titulo, { marginTop: 20 }]}>{item.title}</Text>;
        }

        const data = item.data;

        return (
            <View style={styles.item}>
                {item.type !== 'estoque' && (
                    <Text><Text style={styles.negrito}>Data Hora:</Text> {formatarDataHora(data.dataHora)}</Text>
                )}
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
                    <><Text><Text style={styles.negrito}>Patrimônio:</Text> {data.patrimonio}</Text>
                        <Text><Text style={styles.negrito}>Local Destino:</Text> {data.localDestino || '-'}</Text>
                        <Text><Text style={styles.negrito}>Local Armazenamento:</Text> {data.localArmazenamento || '-'}</Text>
                        <Text><Text style={styles.negrito}>Unidade:</Text> {data.unidade || '-'}</Text>
                    </>
                )}
                {item.type === 'estoque' && (
                    <Text><Text style={styles.negrito}>Unidade:</Text> {data.unidade || '-'}</Text>
                )}
            </View>
        );
    }, [entradas, saidas, estoqueAtual]);

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

            <Button title="Buscar" onPress={buscarDados} />
            <Button title="Exportar Excel" onPress={exportarExcel} disabled={loading} />

            {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />}

            <FlatList
                data={sections}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                style={{ marginTop: 20 }}
            />

            <NavbarBottom navigation={navigation} />
        </View>
    );
}
