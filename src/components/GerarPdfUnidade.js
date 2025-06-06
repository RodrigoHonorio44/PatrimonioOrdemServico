import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const gerarPdfUnidade = async (dados = {}) => {
  console.log('Dados recebidos:', dados);

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
          <meta charset="utf-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .logo {
              display: flex;
              justify-content: center;
              margin-bottom: 10px;
            }
            .logo img {
              max-width: 250px;
              max-height: 250px;
            }
            .subtitle {
              text-align: center;
              font-size: 12px;
              margin-bottom: 4px;
            }
            h1 {
              margin-top: 20px;
              margin-bottom: 35px;
              text-align: center;
              font-size: 18px;
            }
            p {
              margin: 6px 0;
              font-size: 14px;
            }
            .assinaturas {
              display: flex;
              justify-content: space-around;
              margin-top: 150px;
            }
            .assinatura-item {
              text-align: center;
              width: 45%;
            }
            .linha-assinatura {
              margin-top: 5px;
              border-top: 1px solid #000;
              width: 100%;
              height: 1px;
            }
            .assinatura-item img {
              max-height: 100px;
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

          <h1>Entrega de Equipamento </h1>

          <p><strong>Data:</strong> ${dataAtual}</p>
          <p><strong>Unidade:</strong> ${dados?.unidade || 'Não informada'}</p>
          <p><strong>Nome do Responsável:</strong> ${dados?.nomeResponsavel || ''}</p>
          <p><strong>Setor:</strong> ${dados?.setor || ''}</p>
          <p><strong>Descrição do Equipamento:</strong> ${dados?.descricaoEquipamento || ''}</p>
          <p><strong>Nº do Patrimônio:</strong> ${dados?.numeroPatrimonio || ''}</p>
          <p><strong>Motivo:</strong> ${dados?.motivo || ''}</p>
          <p><strong>Nome do Técnico:</strong> ${dados?.nomeTecnico || ''}</p>

          <div class="assinaturas">
            <div class="assinatura-item">
              <img src="${verificarAssinatura(dados?.assinaturaTecnico)}" alt="Assinatura do Técnico" />
              <div class="linha-assinatura"></div>
              <p>${dados?.nomeTecnico || 'Técnico'}</p>
            </div>
            <div class="assinatura-item">
              <img src="${verificarAssinatura(dados?.assinaturaCliente)}" alt="Assinatura do Responsável" />
              <div class="linha-assinatura"></div>
              <p>${dados?.nomeResponsavel || 'Responsável'}</p>
            </div>
          </div>

          <div class="footer">
            Hospital Mahatma Gandhi - Ordem de Serviço | Página 1
          </div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    if (uri) {
      console.log('PDF gerado com sucesso:', uri);
      await Sharing.shareAsync(uri);
    } else {
      throw new Error('Falha ao gerar o PDF: URI não recebida.');
    }
  } catch (error) {
    console.error('Erro ao gerar ou compartilhar PDF da unidade:', error);
    alert('Ocorreu um erro ao gerar ou compartilhar o PDF.');
  }
};

export default gerarPdfUnidade;
