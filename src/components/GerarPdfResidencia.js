import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native';

const gerarPdfResidencia = async (dados) => {
  const verificarAssinatura = (assinatura) => {
    if (!assinatura) return '';
    return assinatura.startsWith('data:image') ? assinatura : '';
  };

  const dataAtual = new Date().toLocaleDateString('pt-BR');

  const loadLogoBase64 = async () => {
    const asset = Asset.fromModule(require('../../assets/hospital.png'));
    await asset.downloadAsync();
    const base64 = await FileSystem.readAsStringAsync(asset.localUri || asset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/png;base64,${base64}`;
  };

  try {
    const logoBase64 = await loadLogoBase64();

    const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 32px;
          font-size: 14px;
          color: #000;
          position: relative;
        }
        .logo {
          text-align: center;
          margin-bottom: 10px;
        }
        .logo img {
          max-width: 180px;
          height: auto;
        }
        .subtitle {
          text-align: center;
          font-size: 12px;
          color: #444;
          margin-bottom: 6px;
        }
        h1 {
          text-align: center;
          font-size: 20px;
          margin-top: 20px;
          margin-bottom: 30px;
        }
        .container {
          border: 1px solid #000;
          padding: 20px;
          border-radius: 8px;
        }
        p {
          margin: 6px 0;
        }
        .assinaturas {
          display: flex;
          justify-content: space-around;
          margin-top: 100px;
          text-align: center;
        }
        .assinatura-item {
          width: 45%;
        }
        .assinatura-item img {
          max-height: 80px;
          margin-bottom: 5px;
        }
        .linha-assinatura {
          margin-top: 5px;
          border-top: 1px solid #000;
          width: 100%;
          height: 1px;
        }
        .footer {
          position: absolute;
          bottom: 20px;
          right: 32px;
          font-size: 11px;
          color: #555;
          text-align: right;
        }
      </style>
    </head>
    <body>
      <div class="logo">
        <img src="${logoBase64}" alt="Logo Hospital" />
      </div>
      <div class="subtitle">Uma nova visão é possível!</div>
      <div class="subtitle">
        MUNICIPAL: Lei nº 961 de 28/08/68 | ESTADUAL: Lei nº 10314 de 13/09/77<br />
        FEDERAL: Decreto de 11/09/92 – Proc. M nº 14555/90-441
      </div>

      <h1>Entrega de Equipamento - Residência</h1>

      <div class="container">
        <p><strong>Data:</strong> ${dataAtual}</p>
        <p><strong>Nome do Responsável:</strong> ${dados.nomeResponsavel || ''}</p>
        <p><strong>Nome do Paciente:</strong> ${dados.nomePaciente || ''}</p>
        <p><strong>Endereço:</strong> ${dados.endereco || ''}</p>
        <p><strong>Telefone:</strong> ${dados.telefone || ''}</p>
        <p><strong>Descrição do Equipamento:</strong> ${dados.descricaoEquipamento || ''}</p>
        <p><strong>Nº do Patrimônio:</strong> ${dados.numeroPatrimonio || ''}</p>
        <p><strong>Nome do Técnico:</strong> ${dados.nomeTecnico || ''}</p>
      </div>

      <div class="assinaturas">
        <div class="assinatura-item">
          <img src="${verificarAssinatura(dados.assinaturaTecnico)}" alt="Assinatura do Técnico" />
          <div class="linha-assinatura"></div>
          <p>${dados.nomeTecnico || 'Técnico'}<br>${dados.horaAssinaturaTecnico || ''}</p>
        </div>
        <div class="assinatura-item">
          <img src="${verificarAssinatura(dados.assinaturaCliente)}" alt="Assinatura do Responsável" />
          <div class="linha-assinatura"></div>
          <p>${dados.nomeResponsavel || 'Responsável'}<br>${dados.horaAssinaturaCliente || ''}</p>
        </div>
      </div>

      <div class="footer">
        Hospital Mahatma Gandhi - Ordem de Serviço | Página 1
      </div>
    </body>
  </html>
`;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    if (!uri) throw new Error('Falha ao gerar o PDF: URI não recebida.');

    let shareableUri = uri;
    if (Platform.OS === 'android') {
      shareableUri = await FileSystem.getContentUriAsync(uri);
    }

    console.log('PDF gerado com sucesso:', shareableUri);
    await Sharing.shareAsync(shareableUri);
  } catch (error) {
    console.error('Erro ao gerar ou compartilhar o PDF:', error);
    alert('Ocorreu um erro ao gerar ou compartilhar o PDF.');
  }
};

export default gerarPdfResidencia;
