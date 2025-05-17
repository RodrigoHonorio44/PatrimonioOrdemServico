import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    ScrollView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Importa hook navigation
import { db } from '../config/firebaseConfig';
import {
    collection,
    query,
    where,
    getDocs,
    Timestamp,
} from 'firebase/firestore';
import { format, parse } from 'date-fns';
import NavbarBottom from '../components/NavbarBottom';
import { styles } from '../styles/RelatorioStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import * as Sharing from 'expo-sharing';

const Relatorio = () => {
    const navigation = useNavigation();

    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [relatorio, setRelatorio] = useState([]);
    const [ordensCompleta, setOrdensCompleta] = useState([]);
    const [totalAtendimentos, setTotalAtendimentos] = useState(0);
    const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
    const [showDatePickerFim, setShowDatePickerFim] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFetchRelatorio = async () => {
        try {
            if (!dataInicio || !dataFim) {
                Alert.alert('Erro', 'Por favor, selecione uma data de início e fim.');
                return;
            }

            setIsLoading(true);

            const dataInicioObj = parse(dataInicio, 'dd/MM/yyyy', new Date());
            const dataFimObj = parse(dataFim, 'dd/MM/yyyy', new Date());

            const dataInicioTimestamp = Timestamp.fromDate(
                new Date(dataInicioObj.setHours(0, 0, 0, 0))
            );
            const dataFimTimestamp = Timestamp.fromDate(
                new Date(dataFimObj.setHours(23, 59, 59, 999))
            );

            const q = query(
                collection(db, 'ordensServico'),
                where('criadoEm', '>=', dataInicioTimestamp),
                where('criadoEm', '<=', dataFimTimestamp)
            );

            const querySnapshot = await getDocs(q);
            const ordens = querySnapshot.docs.map(doc => doc.data());

            const agrupadoPorUnidade = ordens.reduce((acc, ordem) => {
                const unidade = ordem.unidade || 'Não Informado';
                acc[unidade] = (acc[unidade] || 0) + 1;
                return acc;
            }, {});

            setRelatorio(Object.entries(agrupadoPorUnidade));
            setTotalAtendimentos(ordens.length);
            setOrdensCompleta(ordens);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao buscar os dados.');
        } finally {
            setIsLoading(false);
        }
    };

    const onChangeInicio = (event, selectedDate) => {
        setShowDatePickerInicio(Platform.OS === 'ios');
        if (selectedDate) {
            setDataInicio(format(selectedDate, 'dd/MM/yyyy'));
        }
    };

    const onChangeFim = (event, selectedDate) => {
        setShowDatePickerFim(Platform.OS === 'ios');
        if (selectedDate) {
            setDataFim(format(selectedDate, 'dd/MM/yyyy'));
        }
    };

    const exportToExcel = async () => {
        try {
            if (ordensCompleta.length === 0) {
                Alert.alert('Aviso', 'Nenhuma ordem para exportar.');
                return;
            }

            const ws = XLSX.utils.json_to_sheet(
                ordensCompleta.map(ordem => ({
                    Data: ordem.criadoEm?.toDate
                        ? format(ordem.criadoEm.toDate(), 'dd/MM/yyyy')
                        : 'Sem data',
                    Descricao: ordem.descricao || '',
                    NomeResponsavel: ordem.nomeResponsavel || '',
                    Patrimonio: ordem.patrimonio || '',
                    Servico: ordem.servico || '',
                    Setor: ordem.setor || '',
                    Tecnico: ordem.tecnico || '',
                    Unidade: ordem.unidade || 'Não Informado',
                }))
            );

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Ordens de Serviço');

            const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

            const nomeArquivoSeguro = `Relatorio_${dataInicio.replace(/\//g, '-')}_a_${dataFim.replace(/\//g, '-')}.xlsx`;
            const fileUri = FileSystem.documentDirectory + nomeArquivoSeguro;

            await FileSystem.writeAsStringAsync(fileUri, excelData, {
                encoding: FileSystem.EncodingType.Base64,
            });

            Alert.alert('Sucesso', 'Relatório exportado com sucesso!');
            console.log('📁 Arquivo salvo em:', fileUri);

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Erro', 'O compartilhamento não está disponível no seu dispositivo.');
            }
        } catch (error) {
            console.error('Erro ao exportar e compartilhar Excel:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao exportar o relatório.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Relatório de Ordens de Serviço</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Data Início (dd/MM/yyyy)"
                    value={dataInicio}
                    onFocus={() => setShowDatePickerInicio(true)}
                />
                {showDatePickerInicio && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeInicio}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Data Fim (dd/MM/yyyy)"
                    value={dataFim}
                    onFocus={() => setShowDatePickerFim(true)}
                />
                {showDatePickerFim && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeFim}
                    />
                )}

                <View style={styles.buttonContainer}>
                    <Button title="Gerar Relatório" onPress={handleFetchRelatorio} />
                </View>

                {isLoading && <Text style={styles.loadingText}>Carregando...</Text>}

                <View style={styles.buttonContainer}>
                    <Button title="Exportar e Compartilhar Excel" onPress={exportToExcel} />
                </View>

                <View style={styles.relatorioContainer}>
                    <Text style={styles.subtitle}>Atendimentos por Unidade</Text>

                    {relatorio.length > 0 ? (
                        <>
                            <Text style={styles.totalText}>
                                Total de atendimentos: {totalAtendimentos}
                            </Text>
                            {relatorio.map(([unidade, count]) => (
                                <View key={unidade} style={styles.unidadeItem}>
                                    <Text style={styles.unidadeText}>
                                        {unidade}: {count} atendimentos
                                    </Text>
                                </View>
                            ))}
                        </>
                    ) : (
                        <Text style={styles.noDataText}>
                            Nenhum dado encontrado para o período selecionado.
                        </Text>
                    )}
                </View>
            </ScrollView>

            <View style={styles.navbarContainer}>
                <NavbarBottom navigation={navigation} />
            </View>
        </View>
    );
};

export default Relatorio;
