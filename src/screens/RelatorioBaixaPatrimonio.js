import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import styles from '../styles/RelatorioBaixaPatrimonioStyles';
import NavbarBottom from '../components/NavbarBottom';

export default function RelatorioBaixaPatrimonio({ navigation }) {
    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataFim, setDataFim] = useState(new Date());
    const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
    const [showDatePickerFim, setShowDatePickerFim] = useState(false);
    const [resultados, setResultados] = useState([]);

    // Formata data no formato dd/MM/yyyy
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const onChangeInicio = (event, selectedDate) => {
        setShowDatePickerInicio(false);
        if (selectedDate) {
            setDataInicio(selectedDate);
            if (selectedDate > dataFim) {
                setDataFim(selectedDate);
            }
        }
    };

    const onChangeFim = (event, selectedDate) => {
        setShowDatePickerFim(false);
        if (selectedDate) {
            setDataFim(selectedDate);
            if (selectedDate < dataInicio) {
                setDataInicio(selectedDate);
            }
        }
    };

    const buscarPorData = async () => {
        try {
            const inicio = new Date(dataInicio.setHours(0, 0, 0, 0));
            const fim = new Date(dataFim.setHours(23, 59, 59, 999));

            const inicioTimestamp = Timestamp.fromDate(inicio);
            const fimTimestamp = Timestamp.fromDate(fim);

            const q = query(
                collection(db, 'BaixaDePatrimonio'),
                where('dataHora', '>=', inicioTimestamp),
                where('dataHora', '<=', fimTimestamp)
            );

            const querySnapshot = await getDocs(q);
            const dados = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setResultados(dados);

            if (dados.length === 0) {
                Alert.alert('Nenhum resultado', 'Não foram encontradas movimentações neste período.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', `Erro ao buscar movimentações: ${error.message}`);
        }
    };

    const gerarExcel = async () => {
        if (resultados.length === 0) {
            Alert.alert('Atenção', 'Nenhum dado disponível para exportar.');
            return;
        }

        const formatador = new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
        });

        const worksheetData = resultados.map(item => [
            item.dataHora?.toDate ? formatador.format(item.dataHora.toDate()) : '',
            item.patrimonio,
            item.descricao,
            item.localDescarte,
            item.motivo,
            item.unidade,
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([
            ['Data e Hora', 'Patrimônio', 'Descrição', 'Local Descarte', 'Motivo', 'Unidade'],
            ...worksheetData,
        ]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'BaixaPatrimonio');

        const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
        const uri = FileSystem.cacheDirectory + 'relatorio_baixa_patrimonio.xlsx';

        await FileSystem.writeAsStringAsync(uri, wbout, {
            encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(uri);
    };

    // Função para converter dataHora segura
    const formatDataHora = (dataHora) => {
        if (!dataHora) return '';
        if (dataHora.toDate && typeof dataHora.toDate === 'function') {
            return dataHora.toDate().toLocaleString();
        }
        // Caso já seja Date
        if (dataHora instanceof Date) {
            return dataHora.toLocaleString();
        }
        return String(dataHora);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.titulo}>Relatório de Baixa de Patrimônio</Text>

                <Text style={styles.label}>Data Início:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Data Início (dd/MM/yyyy)"
                    placeholderTextColor="#888888"
                    value={formatDate(dataInicio)}
                    onFocus={() => setShowDatePickerInicio(true)}
                />
                {showDatePickerInicio && (
                    <DateTimePicker
                        value={dataInicio || new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeInicio}
                        maximumDate={dataFim || undefined}
                    />
                )}

                <Text style={styles.label}>Data Fim:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Data Fim (dd/MM/yyyy)"
                    placeholderTextColor="#888888"
                    value={formatDate(dataFim)}
                    onFocus={() => setShowDatePickerFim(true)}
                />
                {showDatePickerFim && (
                    <DateTimePicker
                        value={dataFim || new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeFim}
                        minimumDate={dataInicio || undefined}
                    />
                )}

                <Button title="Buscar" onPress={buscarPorData} />

                <FlatList
                    style={styles.lista}
                    data={resultados}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.textCard}>
                                <Text style={styles.negrito}>Data e Hora:</Text> {formatDataHora(item.dataHora)}
                            </Text>
                            <Text style={styles.textCard}>
                                <Text style={styles.negrito}>Patrimônio:</Text> {item.patrimonio}
                            </Text>
                            <Text style={styles.textCard}>
                                <Text style={styles.negrito}>Descrição:</Text> {item.descricao}
                            </Text>
                            <Text style={styles.textCard}>
                                <Text style={styles.negrito}>Local Descarte:</Text> {item.localDescarte}
                            </Text>
                            <Text style={styles.textCard}>
                                <Text style={styles.negrito}>Motivo:</Text> {item.motivo}
                            </Text>
                            <Text style={styles.textCard}>
                                <Text style={styles.negrito}>Unidade:</Text> {item.unidade}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={{ marginTop: 20 }}>Nenhum dado para exibir.</Text>}
                />

                {resultados.length > 0 && (
                    <Button title="Gerar Excel e Compartilhar" onPress={gerarExcel} color="#4CAF50" />
                )}
            </View>

            <NavbarBottom navigation={navigation} />
        </View>
    );
}
