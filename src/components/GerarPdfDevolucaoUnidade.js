import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Alert, Platform } from 'react-native';

const gerarPdfDevolucaoUnidade = async (dados = {}) => {
  console.log('Dados recebidos:', dados);

  const verificarAssinatura = (assinatura) => {
    if (!assinatura) return '';
    return assinatura.startsWith('data:image') ? assinatura : '';
  };

  const formatarHora = (dataHoraString) => {
    if (!dataHoraString) return '';
    const data = new Date(dataHoraString);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const horaTecnico = formatarHora(dados?.horaAssinaturaTecnico);
  const horaCliente = formatarHora(dados?.horaAssinaturaCliente);

  const dataAtual = new Date().toLocaleDateString('pt-BR');

  const loadLogoBase64 = async () => {
    try {
      const asset = Asset.fromModule(require('../../assets/hospital.png'));
      await asset.downloadAsync();
      const uri = asset.localUri || asset.uri;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.warn('Erro ao carregar o logo:', error);
      return '';
    }
  };

  try {
    const logoBase64 = await loadLogoBase64();

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 32px;
              font-size: 14px;
              color: #000;
              position: relative;
              margin: 0;
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
            p {
              margin: 6px 0;
            }
            .assinaturas {
              display: block;
              margin-top: 140px;
              text-align: center;
            }
            .assinatura-item {
              display: inline-block;
              width: 45%;
              vertical-align: top;
              margin: 0 2.5%;
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
              bottom: 32px;
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

          <h1>Devolução de Equipamento - Unidade</h1>

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
              <p>${dados?.nomeTecnico || 'Técnico'}<br />${horaTecnico}</p>
            </div>
            <div class="assinatura-item">
              <img src="${verificarAssinatura(dados?.assinaturaCliente)}" alt="Assinatura do Responsável" />
              <div class="linha-assinatura"></div>
              <p>${dados?.nomeResponsavel || 'Responsável'}<br />${horaCliente}</p>
            </div>
          </div>

          <div class="footer">
            Hospital Mahatma Gandhi - Ordem de Serviço | Página 1
          </div>
        </body>
      </html>
    `;

    const fileName = `pdf_unidade_${Date.now()}.pdf`;
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
      width: 612,
      height: 792,
      fileName,
    });

    if (uri) {
      console.log('PDF gerado com sucesso:', uri);

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo.');
        return;
      }

      await Sharing.shareAsync(uri);
    } else {
      throw new Error('Falha ao gerar o PDF: URI não recebida.');
    }
  } catch (error) {
    console.error('Erro ao gerar ou compartilhar PDF da unidade:', error);
    Alert.alert('Erro', 'Ocorreu um erro ao gerar ou compartilhar o PDF.');
  }
};

export default gerarPdfDevolucaoUnidade;
