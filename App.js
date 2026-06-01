import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Button, TextInput, Alert, SectionList } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { enviarPush } from "./api";
import SelectDropdown from "react-native-select-dropdown";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [token, setToken] = useState("");
  const [erro, setErro] = useState("");
  const [status, setStatus] = useState("Iniciando...");

  // utilizado no input para enviar notificação diretamente para um token aleatorio
  const [outroToken, setOutroToken] = useState("");
  const [outraMessagem, setOutraMensagem] = useState("");
  const [outroTitulo, setOutroTitulo] = useState("");
  // enviado com o botão "Enviar Notificação para outro token"

  // utilizado para enviar notificação para um token pré-selecionado do array
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState("");
  const [tituloPersonalizado, setTituloPersonalizado] = useState("");
  const [tokenSelecionado, setTokenSelecionado] = useState(null);
  // enviado com o botão "Enviar Notificação para token selecionado"

  // array de tokens pre-selecionados
  const tokensPreSelecionados = [
      {token: "ExponentPushToken[3Hv4dVKcWbRyloGKHGbO3s]", nome: 'Nilson'},
      {token: "ExponentPushToken[AUxqR7JMz6k1P6eCCg3ZmP]", nome: 'Chrystian'},
      {token: "ExponentPushToken[jl3Ar8I01hxa__1kKFDW35]", nome: 'Juliana'},
      {token: "ExponentPushToken[OWeM0aOYDHwVbvjRHP7TTe]", nome: 'Sérgio'},
      {token: "ExponentPushToken[ObAUjnLHTJruel2HZ-hBko]", nome: 'brat girl'},
      {token: "ExponentPushToken[JeZS05MO7y5JQxBlLU4yji]", nome: "Danilo"}
  ];
  // é possível enviar notificaões padronizadas para todos os tokens ao mesmo tempo com o botão "Enviar Notificação array salvo"

  useEffect(() => {
    obterToken();
  }, []);

  async function obterToken() {
    try {
      setStatus("Verificando dispositivo...");

      if (!Device.isDevice) {
        setErro("Use um dispositivo físico.");
        return;
      }

      setStatus("Solicitando permissões...");

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } =
          await Notifications.requestPermissionsAsync();

        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        setErro("Permissão de notificação negada.");
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ||
        Constants?.easConfig?.projectId;

      if (!projectId) {
        setErro(
          "ProjectId não encontrado. Verifique o app.json."
        );
        return;
      }

      setStatus("Obtendo token...");

      const pushToken = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      setToken(pushToken.data);
      setStatus("Token obtido com sucesso!");

      console.log("EXPO PUSH TOKEN:");
      console.log(pushToken.data);
    } catch (e) {
      console.log(e);
      setErro(JSON.stringify(e, null, 2));
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        Expo Push Token
      </Text>

      <Button
        title="Enviar Notificação de Teste"
        onPress={() => {
          if (token) {
                enviarPush(token);
              }
            }
          } 
      />

      <Text style={styles.label}>
        Status:
      </Text>

      <Text style={styles.texto}>
        {status}
      </Text>

      <Text style={styles.label}>
        Token:
      </Text>

      <Text selectable style={styles.token}>
        {token || "Nenhum token encontrado"}
      </Text>

      {erro ? (
        <>
          <Text style={styles.label}>
            Erro:
          </Text>

          <Text style={styles.erro}>
            {erro}
          </Text>
        </>
      ) : null}


      <View style={{ marginTop: 20, borderWidth: 1, padding: 20, borderRadius: 10, borderColor: "#5f5f5f" }}>
      <Button
        title="Enviar Notificação para outro token"
        onPress={() => {
          if (outroToken) {
                enviarPush(outroToken, outroTitulo, outraMessagem);
              }
            else {
              Alert.alert("Erro", "Digite um token válido para enviar a notificação.");
            }
            }
          } 
        />

      <TextInput
        style={{ marginTop: 20, borderWidth: 1, padding: 10, borderRadius: 5, borderColor: "#5f5f5f" }}
        placeholder="Digite o token para enviar notificação"
        placeholderTextColor="#5f5f5f"
        value={outroToken}
        onChangeText={setOutroToken}
      />

      <TextInput
        style={{ marginTop: 20, borderWidth: 1, padding: 10, borderRadius: 5, borderColor: "#5f5f5f" }}
        placeholder="Digite o título da notificação"
        placeholderTextColor="#5f5f5f"
        value={outroTitulo}
        onChangeText={setOutroTitulo}
      />

      <TextInput
        style={{ marginTop: 20, borderWidth: 1, padding: 10, borderRadius: 5, borderColor: "#5f5f5f", marginBottom: 40 }}
        placeholder="Digite a mensagem da notificação"
        placeholderTextColor="#5f5f5f"
        value={outraMessagem}
        onChangeText={setOutraMensagem}
      />

      </View>


    <View style={{ marginVertical: 20, borderWidth: 1, padding: 20, borderRadius: 10, borderColor: "#5f5f5f" }}>
      <Button
        title="Enviar Notificação para todos os tokens salvos"
        onPress={() => {
          if (tokensPreSelecionados.length > 0) {
                tokensPreSelecionados.forEach((token) => {
                  enviarPush(token, `Olá ${token.nome || 'usuário sem nome'}`, "Esta notificação foi enviada para um token pré-selecionado!");
                  Alert.alert("Sucesso", `Notificação enviada para ${tokensPreSelecionados.length}!`);
                });
              }
            else {
              Alert.alert("Erro", "Nenhum token pré-selecionado encontrado.");  
            }}
          } 
        />

    </View>

    <View style={{ marginVertical: 20, borderWidth: 1, padding: 20, borderRadius: 10, borderColor: "#5f5f5f" }}>

      <Text style={styles.titulo}>
        Enviar diretamente para tokens pré-selecionados:
      </Text>

     <SelectDropdown
        data={tokensPreSelecionados}
        onSelect={setTokenSelecionado}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {selectedItem ? selectedItem.nome : 'Selecione um token'}
              </Text>
            </View>
          );
        }}

        renderItem={(item, index, isSelected) => {
          return (
            <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#afafaf' }) }}>
              <Text style={styles.dropdownItemTxtStyle}>{item.nome}</Text>
            </View>
          );
        }}

        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      >
      </SelectDropdown>

        <TextInput
          style={{ marginTop: 20, borderWidth: 1, padding: 10, borderRadius: 5, borderColor: "#5f5f5f" }}
          placeholder="Digite o título da notificação"
          placeholderTextColor="#5f5f5f"
          value={tituloPersonalizado}
          onChangeText={setTituloPersonalizado}
        />

        <TextInput
          style={{ marginTop: 20, borderWidth: 1, padding: 10, borderRadius: 5, borderColor: "#5f5f5f", marginBottom: 50 }}
          placeholder="Digite a mensagem da notificação"
          placeholderTextColor="#5f5f5f"
          value={mensagemPersonalizada}
          onChangeText={setMensagemPersonalizada}
        />

        <Button
          onPress={() => {
            if (tokenSelecionado) {
              enviarPush(tokenSelecionado.token, tituloPersonalizado || `Olá ${tokenSelecionado.nome || 'usuário sem nome'}`, mensagemPersonalizada || "Esta notificação foi enviada para um token pré-selecionado!");
              Alert.alert("Sucesso", `Notificação enviada para ${tokenSelecionado.nome || 'usuário sem nome'}!`);
              setMensagemPersonalizada("");
              setTituloPersonalizado("");
            } else {
              Alert.alert("Erro", "Selecione um token para enviar a notificação.");
            }
          }}

          title="Enviar Notificação para token selecionado"
          />
          
      </View>

      <View style={{ height: 300 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  texto: {
    fontSize: 14,
  },
  token: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  erro: {
    color: "red",
    marginTop: 10,
  },
  dropdownItemTxtStyle: {
    fontSize: 14,
    color: "#000", 
    margin: 5,
    borderRadius: 5,
  },
  dropdownItemStyle: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButtonTxtStyle: {
    fontSize: 14,
    color: '#000',
  }
});