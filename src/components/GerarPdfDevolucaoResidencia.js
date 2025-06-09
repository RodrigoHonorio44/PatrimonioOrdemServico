import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Alert, Platform } from 'react-native';

import { db, auth } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const verificarAssinatura = (assinatura) => {
  return assinatura?.startsWith('data:image') ? assinatura : '';
};

const loadLogoBase64 = async () => {
  try {
    const asset = Asset.fromModule(require('../../assets/hospital.png'));
    await asset.downloadAsync();
    const base64 = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('Erro ao carregar o logo:', error);
    return '';
  }
};

const gerarPdfDevolucaoResidencia = async (dados) => {
  try {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const logoBase64 = await loadLogoBase64();

    const htmlContent = `...`; // (mantém seu HTML igual, sem mudanças)

    // Gera o PDF
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    if (!uri) throw new Error('Falha ao gerar o PDF: URI não recebida.');

    // No Android, às vezes precisa mover o arquivo para `documentDirectory`
    let pdfUri = uri;
    if (Platform.OS === 'android') {
      const newPath = FileSystem.documentDirectory + 'devolucao_residencia.pdf';
      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });
      pdfUri = newPath;
    }

    // Verifica se o compartilhamento está disponível
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(pdfUri);
    } else {
      Alert.alert('PDF gerado', `Arquivo salvo em:\n${pdfUri}`);
    }

    // Salva os dados no Firestore se o usuário estiver autenticado
    const user = auth.currentUser;
    if (!user) {
      console.log('Usuário não autenticado. Dados não enviados.');
      return;
    }

    await addDoc(collection(db, 'devolucoesResidencia'), {
      data: dataAtual,
      nomeResponsavel: dados.nomeResponsavel || '',
      nomePaciente: dados.nomePaciente || '',
      endereco: dados.endereco || '',
      telefone: dados.telefone || '',
      descricaoEquipamento: dados.descricaoEquipamento || '',
      numeroPatrimonio: dados.numeroPatrimonio || '',
      nomeTecnico: dados.nomeTecnico || '',
      criadoPor: user.email,
      criadoEm: new Date(),
    });

    console.log('Dados salvos com sucesso no Firestore.');
  } catch (error) {
    console.error('Erro ao gerar PDF ou salvar dados:', error);
    Alert.alert('Erro', 'Ocorreu um erro ao gerar ou salvar os dados.');
  }
};

export default gerarPdfDevolucaoResidencia;
