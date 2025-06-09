import React, { useState } from 'react';
import { View, Text, Pressable, Button, Alert, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import styles from '../styles/RelatorioEntregasEquipamentosStyles';
import NavbarBottom from '../components/NavbarBottom';

const devolucao_Residencia = collection(db, 'devolucao_Residencia');
const devolucao_unidade = collection(db, 'devolucao_unidade');

export default function RelatorioDevolucaoDeEquipamento({ navigation }) {
    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataFim, setDataFim] = useState(new Date());
    const [mostrarInicio, setMostrarInicio] = useState(false);
    const [mostrarFim, setMostrarFim] = useState(false);
    const [residenciaDados, setResidenciaDados] = useState([]);
    const [unidadesDados, setUnidadesDados] = useState([]);

    const buscarDados = async () => {
        try {
            const inicio = new Date(dataInicio);
            inicio.setHours(0, 0, 0, 0);
            const fim = new Date(dataFim);
            fim.setHours(23, 59, 59, 999);

            const inicioTimestamp = Timestamp.fromDate(inicio);
            const fimTimestamp = Timestamp.fromDate(fim);

            const qResidencia = query(
                devolucao_Residencia,
                where('data', '>=', inicioTimestamp),
                where('data', '<=', fimTimestamp)
            );
            const snapshotResidencia = await getDocs(qResidencia);
            const dadosResidencia = snapshotResidencia.docs.map(doc => doc.data());
            setResidenciaDados(dadosResidencia);

            const qUnidades = query(
                devolucao_unidade,
                where('data', '>=', inicioTimestamp),
                where('data', '<=', fimTimestamp)
            );
            const snapshotUnidades = await getDocs(qUnidades);
            const dadosUnidades = snapshotUnidades.docs.map(doc => doc.data());
            setUnidadesDados(dadosUnidades);

            if (dadosResidencia.length === 0 && dadosUnidades.length === 0) {
                Alert.alert('Nenhum resultado', 'Não foram encontradas devoluções neste período.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', `Erro ao buscar dados: ${error.message}`);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        if (date.toDate) date = date.toDate();
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    };

    const gerarExcel = async () => {
        if (residenciaDados.length === 0 && unidadesDados.length === 0) {
            Alert.alert('Atenção', 'Nenhum dado disponível para exportar.');
            return;
        }

        const wsResidenciaData = residenciaDados.map(item => [
            formatDate(item.data),
            item.descricaoEquipamento || '',
            item.endereco || '',
            item.nomePaciente || '',
            item.nomeResponsavel || '',
            item.nomeTecnico || '',
            item.numeroPatrimonio || '',
            item.telefone || '',
        ]);
        const wsResidencia = XLSX.utils.aoa_to_sheet([
            ['Data', 'Descrição Equipamento', 'Endereço', 'Nome Paciente', 'Nome Responsável', 'Nome Técnico', 'Número Patrimônio', 'Telefone'],
            ...wsResidenciaData,
        ]);

        const wsUnidadesData = unidadesDados.map(item => [
            formatDate(item.data),
            item.descricaoEquipamento || '',
            item.motivo || '',
            item.nomeResponsavel || '',
            item.nomeTecnico || '',
            item.numeroPatrimonio || '',
            item.setor || '',
            item.tipoLocal || '',
        ]);
        const wsUnidades = XLSX.utils.aoa_to_sheet([
            ['Data', 'Descrição Equipamento', 'Motivo', 'Nome Responsável', 'Nome Técnico', 'Número Patrimônio', 'Setor', 'Tipo Local'],
            ...wsUnidadesData,
        ]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, wsResidencia, 'DevolucaoResidencia');
        XLSX.utils.book_append_sheet(workbook, wsUnidades, 'DevolucaoUnidades');

        const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
        const uri = FileSystem.cacheDirectory + 'relatorio_devolucao.xlsx';

        await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
        await Sharing.shareAsync(uri);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.titulo}>Relatório de Devolução</Text>

                <Text style={styles.label}>Data Início:</Text>
                <Pressable onPress={() => setMostrarInicio(true)}>
                    <Text style={styles.input}>{dataInicio.toLocaleDateString()}</Text>
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

                <Text style={styles.label}>Data Fim:</Text>
                <Pressable onPress={() => setMostrarFim(true)}>
                    <Text style={styles.input}>{dataFim.toLocaleDateString()}</Text>
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
                <View style={{ paddingTop: 5 }}>
                    <Button title="Buscar Dados" onPress={buscarDados} />
                </View>

                <Text style={[styles.titulo, { marginTop: 20 }]}>Devolução Equipamento Residência</Text>
                <FlatList
                    data={residenciaDados}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Data:</Text> {formatDate(item.data)}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Equipamento:</Text> {item.descricaoEquipamento}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Endereço:</Text> {item.endereco}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Paciente:</Text> {item.nomePaciente}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Responsável:</Text> {item.nomeResponsavel}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Técnico:</Text> {item.nomeTecnico}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Patrimônio:</Text> {item.numeroPatrimonio}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Telefone:</Text> {item.telefone}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text>Nenhum dado encontrado para Residência.</Text>}
                />

                <Text style={[styles.titulo, { marginTop: 20 }]}>Devolução de Equipamento Unidade</Text>
                <FlatList
                    data={unidadesDados}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Data:</Text> {formatDate(item.data)}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Equipamento:</Text> {item.descricaoEquipamento}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Motivo:</Text> {item.motivo}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Responsável:</Text> {item.nomeResponsavel}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Técnico:</Text> {item.nomeTecnico}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Patrimônio:</Text> {item.numeroPatrimonio}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Setor:</Text> {item.setor}
                            </Text>
                            <Text style={{ color: '#000' }}>
                                <Text style={styles.negrito}>Tipo Local:</Text> {item.tipoLocal}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text>Nenhum dado encontrado para Unidades.</Text>}
                />

                {(residenciaDados.length > 0 || unidadesDados.length > 0) && (
                    <Button title="Gerar Excel e Compartilhar" onPress={gerarExcel} color="#4CAF50" />
                )}
            </View>

            <NavbarBottom navigation={navigation} />
        </View>
    );
}
