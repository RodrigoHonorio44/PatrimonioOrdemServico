import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from '../context/AuthContext';

// Telas públicas
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import EsqueceuSenha from '../screens/EsqueceuSenha';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

// Telas privadas
import HomeScreen from '../screens/HomeScreen';
import OrdemServico from '../screens/OrdemServico';
import EntregaDeEquipamento from '../screens/EntregaDeEquipamento';
import ListaDeTarefas from '../screens/ListaDeTarefa';
import TarefasTecnico from '../screens/TarefasTecnico';
import Relatorio from '../screens/Relatorio';
import Relatorios from '../screens/Relatorios';
import RelatorioEstoque from '../screens/RelatorioEstoque';
import Estoque from '../screens/Estoque';
import BaixaPatrimonio from '../screens/BaixaPatrimonio';
import RelatorioBaixaPatrimonio from '../screens/RelatorioBaixaPatrimonio';
import RelatorioEntregasEquipamentos from '../screens/RelatorioEntregasEquipamentos';
import Assinatura from '../screens/Assinatura';
import Chat from '../screens/Chat';
import Sobre from '../screens/Sobre';
import DevolucaoDeEquipamento from '../screens/DevolucaoDeEquipamento';

const Stack = createStackNavigator();

function Routes() {
    const { user, authLoading } = useContext(AuthContext);

    if (authLoading) {
        return <AuthLoadingScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user
                ? [
                    <Stack.Screen key="Home" name="Home" component={HomeScreen} />,
                    <Stack.Screen key="OrdemServico" name="OrdemServico" component={OrdemServico} />,
                    <Stack.Screen key="EntregaDeEquipamento" name="EntregaDeEquipamento" component={EntregaDeEquipamento} />,
                    <Stack.Screen key="ListaDeTarefas" name="ListaDeTarefas" component={ListaDeTarefas} />,
                    <Stack.Screen key="TarefasTecnico" name="TarefasTecnico" component={TarefasTecnico} />,
                    <Stack.Screen key="Relatorio" name="Relatorio" component={Relatorio} />,
                    <Stack.Screen key="Relatorios" name="Relatorios" component={Relatorios} />,
                    <Stack.Screen key="RelatorioEstoque" name="RelatorioEstoque" component={RelatorioEstoque} />,
                    <Stack.Screen key="Estoque" name="Estoque" component={Estoque} />,
                    <Stack.Screen key="BaixaPatrimonio" name="BaixaPatrimonio" component={BaixaPatrimonio} />,
                    <Stack.Screen key="RelatorioBaixaPatrimonio" name="RelatorioBaixaPatrimonio" component={RelatorioBaixaPatrimonio} />,
                    <Stack.Screen key="RelatorioEntregasEquipamentos" name="RelatorioEntregasEquipamentos" component={RelatorioEntregasEquipamentos} />,
                    <Stack.Screen key="Assinatura" name="Assinatura" component={Assinatura} />,
                    <Stack.Screen key="Chat" name="Chat" component={Chat} />,
                    <Stack.Screen key="Sobre" name="Sobre" component={Sobre} />,
                    <Stack.Screen key="DevolucaoDeEquipamento" name="DevolucaoDeEquipamento" component={DevolucaoDeEquipamento} />,
                ]
                : [
                    <Stack.Screen key="Welcome" name="Welcome" component={WelcomeScreen} />,
                    <Stack.Screen key="Login" name="Login" component={LoginScreen} />,
                    <Stack.Screen key="Cadastro" name="Cadastro" component={CadastroScreen} />,
                    <Stack.Screen key="EsqueceuSenha" name="EsqueceuSenha" component={EsqueceuSenha} />,
                ]}
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Routes />
            </NavigationContainer>
        </AuthProvider>
    );
}
