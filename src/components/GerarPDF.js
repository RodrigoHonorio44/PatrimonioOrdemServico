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
              padding: 24px;
              font-size: 14px;
              color: #333;
            }
            h1 {
              text-align: center;
              font-size: 22px;
              margin-top: 10px;
              margin-bottom: 20px;
            }
            .info {
              margin: 10px 0;
            }
            .label {
              font-weight: bold;
            }
            .logo {
              display: block;
              margin: 0 auto 20px auto;
              max-width: 200px;
            }
            .assinaturas {
              display: flex;
              justify-content: space-around;
              margin-top: 40px;
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
          </style>
        </head>
        <body>
          <img src="${logo}" class="logo" />
          <h1>Ordem de Serviço</h1>
          
          <div class="info"><span class="label">Data:</span> ${dataAtual}</div>
          <div class="info"><span class="label">Unidade:</span> ${unidade}</div>
          <div class="info"><span class="label">Nome do Responsável:</span> ${nomeResponsavel}</div>
          <div class="info"><span class="label">Setor:</span> ${setor}</div>
          <div class="info"><span class="label">Descrição do Equipamento:</span> ${descricao}</div>
          <div class="info"><span class="label">N° do Patrimônio:</span> ${patrimonio}</div>
          <div class="info"><span class="label">Serviço Realizado:</span> ${servico}</div>
          <div class="info"><span class="label">Técnico Responsável:</span> ${nomeTecnico}</div>

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
