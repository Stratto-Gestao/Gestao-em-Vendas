const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Inicializa o Firebase Admin SDK.
// Não precisa de credenciais aqui, pois ele roda dentro do ambiente do Firebase.
admin.initializeApp();

const app = express();
const db = admin.firestore();

// Permite que seu app React (rodando em outra URL) se comunique com esta função.
app.use(cors({ origin: true }));
// Permite que o servidor entenda o formato JSON que o React enviará.
app.use(express.json());

// --- Middleware de Segurança: Verifica se quem chama a API é um Admin ---
const checkIfAdmin = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).send("Não autorizado: Token não fornecido.");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(403).send("Proibido: Usuário admin não encontrado.");
    }

    // AQUI ESTÁ A CORREÇÃO
    const userRole = userDoc.data().profile.role;
    const adminRoles = ["SUPER_ADMIN", "ADMIN_OPERACIONAL"];

    if (adminRoles.includes(userRole)) {
      req.user = decodedToken;
      return next();
    } else {
      return res.status(403).send("Proibido: Privilégios insuficientes.");
    }
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return res.status(401).send("Não autorizado: Token inválido.");
  }
};

// --- Rota Principal: /createUser ---
app.post("/createUser", checkIfAdmin, async (req, res) => {
  try {
    const { email, password, name, role, department } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(400).send("Dados insuficientes para criar usuário.");
    }

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
      emailVerified: true,
      disabled: false,
    });

    // Define a 'role' como uma Custom Claim no perfil de autenticação.
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

    await db.collection("users").doc(userRecord.uid).set({
      name: name,
      email: email,
      role: role,
      department: department || "",
      createdAt: new Date(),
      active: true,
      createdBy: req.user.uid,
    });

    return res.status(201).send({ message: "Usuário criado com sucesso!", uid: userRecord.uid });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if (error.code === "auth/email-already-exists") {
      return res.status(409).send("O email fornecido já está em uso.");
    }
    return res.status(500).send("Erro interno do servidor ao criar usuário.");
  }
});

// Função temporária para corrigir o claim do admin
app.post("/fixAdminClaim", async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`Tentando corrigir o usuário: ${email}`);
        const user = await admin.auth().getUserByEmail(email);
        // Define as custom claims: role e admin
        await admin.auth().setCustomUserClaims(user.uid, { role: 'SUPER_ADMIN', admin: true });
        console.log(`Sucesso! Permissões 'SUPER_ADMIN' e 'admin: true' adicionadas ao token do usuário ${email}`);
        return res.send(`Sucesso! O usuário ${email} agora tem as permissões SUPER_ADMIN e admin: true no token.`);
    } catch (error) {
        console.error("Erro ao corrigir claim:", error);
        return res.status(500).send(error.message);
    }
});

// Exporta o app Express como uma única Cloud Function chamada "api".
// Toda vez que alguém acessar a URL da função, o Express cuidará da rota.
exports.api = functions.https.onRequest(app);