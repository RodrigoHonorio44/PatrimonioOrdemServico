import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { Asset } from 'expo-asset';

import { db, auth } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

// Garante que apenas imagens base64 válidas sejam renderizadas
const verificarAssinatura = (assinatura) => {
  return assinatura?.startsWith('data:image') ? assinatura : '';
};

// Carrega o logo do hospital como base64
const loadLogoBase64 = async () => {
  try {
    const asset = Asset.fromModule(require('../../assets/hospital.png'));
    await asset.downloadAsync();
    const base64 = await FileSystem.readAsStringAsync(asset.localUri || asset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('Erro ao carregar o logo:', error);
    return '';
  }
};

// Função principal para gerar e compartilhar PDF
const GerarPDF = async ({
  dataAtual,
  nomeResponsavel,
  setor,
  descricao,
  patrimonio,
  servico,
  nomeTecnico,
  unidade,
  assinaturaTecnico,
  assinaturaCliente,
}) => {
  try {
    const logo = await loadLogoBase64();

    const htmlContent = `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 32px;
        font-size: 14px;
        color: #000;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .header {
        text-align: center;
        margin-bottom: 10px;
      }
      .logo {
        max-width: 140px;
        margin: 0 auto 10px;
      }
      .subtitle {
        font-size: 12px;
        color: #444;
        margin-bottom: 20px;
      }
      h1 {
        text-align: center;
        font-size: 22px;
        margin: 10px 0 20px;
      }
      .campo {
        margin-bottom: 12px;
      }
      .assinaturas {
        display: flex;
        justify-content: space-around;
        text-align: center;
        margin-top: 40px;
      }
      .assinatura img {
        height: 80px;
        margin-bottom: 5px;
      }
      .assinatura p {
        margin: 0;
        font-size: 12px;
        border-top: 1px solid #000;
        padding-top: 4px;
      }
      .footer {
        text-align: right;
        font-size: 11px;
        color: #555;
        margin-top: 390px;
      }
    </style>
  </head>
  <body>
    <div>
      <div class="header">
        <img src="${logo}" class="logo" />
        <div class="subtitle">Uma nova visão é possível!</div>
        <div class="subtitle">
          MUNICIPAL: Lei nº 961 de 28/08/68 | ESTADUAL: Lei nº 10314 de 13/09/77<br />
          FEDERAL: Decreto de 11/09/92 – Proc. M nº 14555/90-441
        </div>
      </div>

      <h1>Ordem de Serviço</h1>

      <div class="campo">Data: ${dataAtual}</div>
      <div class="campo">Unidade: ${unidade}</div>
      <div class="campo">Nome do Responsável: ${nomeResponsavel}</div>
      <div class="campo">Setor: ${setor}</div>
      <div class="campo">Descrição do Equipamento: ${descricao}</div>
      <div class="campo">N° do Patrimônio: ${patrimonio}</div>
      <div class="campo">Serviço Realizado: ${servico}</div>
      <div class="campo">Técnico Responsável: ${nomeTecnico}</div>

      <div class="assinaturas">
        <div class="assinatura">
          <img src="${verificarAssinatura(assinaturaTecnico)}" />
          <p>${nomeTecnico}</p>
        </div>
        <div class="assinatura">
          <img src="${verificarAssinatura(assinaturaCliente)}" />
          <p>${nomeResponsavel}</p>
        </div>
      </div>
    </div>

    <div class="footer">
      Hospital Mahatma Gandhi - Ordem de Serviço | Página 1
    </div>
  </body>
</html>
`;

    // Gera nome do arquivo com data/hora
    const now = new Date();
    const dataHoraFormatada = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
    const nomeArquivo = `OrdemServico_${dataHoraFormatada}.pdf`;

    // Gera o PDF com nome customizado
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      fileName: nomeArquivo,
    });

    // Verifica disponibilidade de compartilhamento
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Erro', 'Compartilhamento não está disponível neste dispositivo.');
      return;
    }

    // Compartilha o PDF
    await Sharing.shareAsync(uri);

    // Salva no Firestore se o usuário estiver logado
    const user = auth.currentUser;
    if (!user) {
      console.log('Usuário não autenticado. Dados não enviados.');
      return;
    }

    await addDoc(collection(db, 'ordensServico'), {
      data: dataAtual,
      unidade,
      nomeResponsavel,
      setor,
      descricao,
      patrimonio,
      servico,
      tecnico: nomeTecnico,
      criadoPor: user.email,
      criadoEm: new Date(),
    });

    console.log('Dados salvos com sucesso no Firestore.');
  } catch (error) {
    console.error('Erro ao gerar PDF ou salvar dados:', error);
    Alert.alert('Erro', 'Ocorreu um erro ao gerar ou salvar os dados.');
  }
};

export default GerarPDF;
