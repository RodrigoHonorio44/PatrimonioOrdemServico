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

    // Se quiser mostrar picker de hora separado
    const [mostrarHoraInicio, setMostrarHoraInicio] = useState(false);
    const [mostrarHoraFim, setMostrarHoraFim] = useState(false);

    const [entradas, setEntradas] = useState([]);
    const [saidas, setSaidas] = useState([]);
    const [loading, setLoading] = useState(false);

    //... mesma função formatarDataHora, buscarDados, exportarExcel, renderItem ...

    return (
        <View style={styles.container}>
            <Text style={styles.tituloGeral}>Relatório de Estoque</Text>

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

                    <Pressable onPress={() => setMostrarHoraInicio(true)} style={[styles.datePicker, { marginTop: 5 }]}>
                        <Text>{dataInicio.toLocaleTimeString()}</Text>
                    </Pressable>
                    {mostrarHoraInicio && (
                        <DateTimePicker
                            value={dataInicio}
                            mode="time"
                            display="default"
                            onChange={(event, date) => {
                                setMostrarHoraInicio(false);
                                if (date) {
                                    const novaData = new Date(dataInicio);
                                    novaData.setHours(date.getHours());
                                    novaData.setMinutes(date.getMinutes());
                                    setDataInicio(novaData);
                                }
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

                    <Pressable onPress={() => setMostrarHoraFim(true)} style={[styles.datePicker, { marginTop: 5 }]}>
                        <Text>{dataFim.toLocaleTimeString()}</Text>
                    </Pressable>
                    {mostrarHoraFim && (
                        <DateTimePicker
                            value={dataFim}
                            mode="time"
                            display="default"
                            onChange={(event, date) => {
                                setMostrarHoraFim(false);
                                if (date) {
                                    const novaData = new Date(dataFim);
                                    novaData.setHours(date.getHours());
                                    novaData.setMinutes(date.getMinutes());
                                    setDataFim(novaData);
                                }
                            }}
                        />
                    )}
                </View>
            </View>

            {/* resto do código... */}
        </View>
    );
}
