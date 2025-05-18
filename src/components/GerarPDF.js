import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { Asset } from 'expo-asset';

import { db, auth } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const verificarAssinatura = (assinatura) => {
  if (!assinatura) return '';
  return assinatura.startsWith('data:image') ? assinatura : '';
};

const loadLogoBase64 = async () => {
  const asset = Asset.fromModule(require('../../assets/HospitalMG.png'));
  await asset.downloadAsync();
  const base64 = await FileSystem.readAsStringAsync(asset.localUri || asset.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:image/png;base64,${base64}`;
};

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
        min-height: 100vh;
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
        margin-top: 10px;
        margin-bottom: 20px;
      }
      h1::after {
        content: "";
        display: block;
        margin: 8px auto 0;
        width: 60%;
      }
      .campo {
        margin-bottom: 20px;
      }
      .assinaturas {
        display: flex;
        justify-content: space-around;
        text-align: center;
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




    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);

    const user = auth.currentUser;
    if (!user) {
      console.log('Usuário não está logado. Dados não serão enviados.');
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

    console.log('Dados salvos no Firestore com sucesso.');
  } catch (error) {
    console.error('Erro ao gerar PDF ou salvar dados:', error);
    Alert.alert('Erro', 'Ocorreu um erro ao gerar ou salvar os dados.');
  }
};

export default GerarPDF;
