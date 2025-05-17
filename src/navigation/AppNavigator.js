import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../context/AuthContext';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import HomeScreen from '../screens/HomeScreen';
import OrdemServico from '../screens/OrdemServico';
import EntregaDeEquipamento from '../screens/EntregaDeEquipamento';
import ListaDeTarefas from '../screens/ListaDeTarefa';
import TarefasTecnico from '../screens/TarefasTecnico';
import EsqueceuSenha from '../screens/EsqueceuSenha';
import Assinatura from '../screens/Assinatura'; // ✅ Importação da nova tela
import Relatorio from '../screens/Relatorio'
import Relatorios from '../screens/Relatorios'
import Estoque from '../screens/Estoque'
const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="AuthLoading">
                    <Stack.Screen
                        name="AuthLoading"
                        component={AuthLoadingScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Cadastro"
                        component={CadastroScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="OrdemServico"
                        component={OrdemServico}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="EntregaDeEquipamento"
                        component={EntregaDeEquipamento}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ListaDeTarefas"
                        component={ListaDeTarefas}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="TarefasTecnico"
                        component={TarefasTecnico}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Relatorio"
                        component={Relatorio}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Relatorios"
                        component={Relatorios}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Estoque"
                        component={Estoque}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="EsqueceuSenha"
                        component={EsqueceuSenha}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Assinatura"
                        component={Assinatura}
                        options={{ headerShown: false }} // ✅ Tela adicionada
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
}
