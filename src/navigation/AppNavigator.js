import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../context/AuthContext';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen'; // ⬅️ Adicionado aqui
import HomeScreen from '../screens/HomeScreen';
import OrdemServico from '../screens/OrdemServico'; // ⬅️ Importando a tela de Ordem de Serviço
import EntregaDeEquipamento from '../screens/EntregaDeEquipamento'; // ⬅️ Importando EntregaDeEquipamento
import ListaDeTarefas from '../screens/ListaDeTarefa'; // importação
import TarefasTecnico from '../screens/TarefasTecnico';
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
                        options={{ headerShown: false }} // ou true se quiser exibir o header
                    />
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="OrdemServico"
                        component={OrdemServico}
                        options={{ headerShown: false }} // ou true se quiser exibir o header
                    />
                    {/* Aqui adicionamos a tela EntregaDeEquipamento */}
                    <Stack.Screen
                        name="EntregaDeEquipamento"
                        component={EntregaDeEquipamento}
                        options={{ headerShown: false }} // ou true se quiser exibir o header
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
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
}
