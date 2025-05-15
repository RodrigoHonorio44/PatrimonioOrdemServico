import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const gerarPdfResidencia = async (dados) => {
    const verificarAssinatura = (assinatura) => {
        if (!assinatura) return '';
        return assinatura.startsWith('data:image') ? assinatura : '';
    };

    const dataAtual = new Date().toLocaleDateString('pt-BR');

    const loadLogoBase64 = async () => {
        const asset = Asset.fromModule(require('../../assets/HospitalMG.png'));
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
            h1 {
              margin-top: 20px;
              margin-bottom: 35px;
              text-align: center;
            }
            p {
              margin: 6px 0;
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
            img {
              max-height: 100px;
            }
          </style>
        </head>
        <body>
          <div class="logo">
            <img src="${logoBase64}" alt="Logo Hospital" />
          </div>

          <h1>Entrega de Equipamento - Residência</h1>

          <p><strong>Data:</strong> ${dataAtual}</p>
          <p><strong>Nome do Responsável:</strong> ${dados.nomeResponsavel || ''}</p>
          <p><strong>Nome do Paciente:</strong> ${dados.nomePaciente || ''}</p>
          <p><strong>Endereço:</strong> ${dados.endereco || ''}</p>
          <p><strong>Telefone:</strong> ${dados.telefone || ''}</p>
          <p><strong>Descrição do Equipamento:</strong> ${dados.descricaoEquipamento || ''}</p>
          <p><strong>Nº do Patrimônio:</strong> ${dados.numeroPatrimonio || ''}</p>
          <p><strong>Nome do Técnico:</strong> ${dados.nomeTecnico || ''}</p>

          <div class="assinaturas">
            <div class="assinatura-item">
              <img src="${verificarAssinatura(dados.assinaturaTecnico)}" alt="Assinatura do Técnico" />
              <div class="linha-assinatura"></div>
              <p>${dados.nomeTecnico || 'Técnico'}</p>
            </div>
            <div class="assinatura-item">
              <img src="${verificarAssinatura(dados.assinaturaCliente)}" alt="Assinatura do Responsável" />
              <div class="linha-assinatura"></div>
              <p>${dados.nomeResponsavel || 'Responsável'}</p>
            </div>
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
        console.error('Erro ao gerar o PDF:', error);
        alert('Ocorreu um erro ao gerar ou compartilhar o PDF.');
    }
};

export default gerarPdfResidencia;
