import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const gerarPdfUnidade = async (dados) => {
    const verificarAssinatura = (assinatura) => {
        if (!assinatura) return '';
        return assinatura.startsWith('data:image') ? assinatura : '';
    };

    const dataAtual = new Date().toLocaleDateString('pt-BR');

    // Carrega imagem da logo em base64
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
                            max-width: 300px;
                            max-height: 300px;
                        }
                        h1, {
                            text-align: center;
                            margin: 0;
                        }
                            h3, h4 {
                            text-align: left;
                            margin: 0;
                        }
                        h1 {
                            margin-top: 20px;
                            margin-bottom: 10px;
                        }
                        h3 {
                            margin-bottom: 5px;
                            font-weight: normal;
                        }
                        h4 {
                            margin-bottom: 25px;
                            font-weight: normal;
                        }
                        .data-paragrafo {
                            margin-top: 20px;
                        }
                        .assinaturas {
                            display: flex;
                            justify-content: space-around;
                            margin-top: 200px;
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

                    <h1>Entrega de Equipamento - ${dados.unidade || 'Unidade'}</h1>
                    
                    <h4>Data: ${dataAtual}</h4>
                    <h3>Responsável: ${dados.nomeResponsavel || '-'}</h3>
                    <p><strong>Setor:</strong> ${dados.setor || ''}</p>
                    <p><strong>Descrição do Equipamento:</strong> ${dados.descricaoEquipamento || ''}</p>
                    <p><strong>Número do Patrimônio:</strong> ${dados.numeroPatrimonio || ''}</p>
                    <p><strong>Motivo:</strong> ${dados.motivo || ''}</p>
                    <p><strong>Nome do Técnico:</strong> ${dados.nomeTecnico || ''}</p>

                    <div class="assinaturas">
                        <div class="assinatura-item">
                            <img src="${verificarAssinatura(dados.assinaturaTecnico)}" alt="Assinatura do Técnico" />
                            <div class="linha-assinatura"></div>
                            <p>Assinatura - ${dados.nomeTecnico || 'Técnico'}</p>
                        </div>
                        <div class="assinatura-item">
                            <img src="${verificarAssinatura(dados.assinaturaCliente)}" alt="Assinatura do Cliente" />
                            <div class="linha-assinatura"></div>
                            <p>Assinatura - ${dados.nomeResponsavel || 'Responsável'}</p>
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
        console.error('Erro ao gerar ou compartilhar PDF da unidade:', error);
        alert('Ocorreu um erro ao gerar ou compartilhar o PDF.');
    }
};

export default gerarPdfUnidade;
