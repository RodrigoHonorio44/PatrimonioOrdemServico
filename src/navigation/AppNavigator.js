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
import RelatorioDevolucaoDeEquipamento from '../screens/RelatorioDevolucaoDeEquipamento';

const Stack = createStackNavigator();

function Routes() {
    const { user, authLoading } = useContext(AuthContext);

    if (authLoading) {
        return <AuthLoadingScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="OrdemServico" component={OrdemServico} />
                    <Stack.Screen name="EntregaDeEquipamento" component={EntregaDeEquipamento} />
                    <Stack.Screen name="ListaDeTarefas" component={ListaDeTarefas} />
                    <Stack.Screen name="TarefasTecnico" component={TarefasTecnico} />
                    <Stack.Screen name="Relatorio" component={Relatorio} />
                    <Stack.Screen name="Relatorios" component={Relatorios} />
                    <Stack.Screen name="RelatorioEstoque" component={RelatorioEstoque} />
                    <Stack.Screen name="Estoque" component={Estoque} />
                    <Stack.Screen name="BaixaPatrimonio" component={BaixaPatrimonio} />
                    <Stack.Screen name="RelatorioBaixaPatrimonio" component={RelatorioBaixaPatrimonio} />
                    <Stack.Screen name="RelatorioEntregasEquipamentos" component={RelatorioEntregasEquipamentos} />
                    <Stack.Screen name="Assinatura" component={Assinatura} />
                    <Stack.Screen name="Chat" component={Chat} />
                    <Stack.Screen name="Sobre" component={Sobre} />
                    <Stack.Screen name="DevolucaoDeEquipamento" component={DevolucaoDeEquipamento} />
                    <Stack.Screen name="RelatorioDevolucaoDeEquipamento" component={RelatorioDevolucaoDeEquipamento} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Cadastro" component={CadastroScreen} />
                    <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
                </>
            )}
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
