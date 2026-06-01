const axios = require('axios');

export async function enviarPush(token, title = "Notificação de Teste", body = "Esta é uma notificação de teste enviada do Node.js!") {
    try {
        const response = await axios.post(
            "https://exp.host/--/api/v2/push/send",
            {
                to: token,
                title: title,
                body: body,
                data: {
                    tela: "Detalhes",
                    id: 123,
                }
            },
            {
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log("Notificação enviada com sucesso:", response.data);

    } catch (error) {

        console.error("Erro ao enviar notificação:", error.response ? error.response.data : error.message);

    };
};