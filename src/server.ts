import Express from "express";
import { UserHandler } from "./modules/User/handlers/user.handler";
import { authMiddleware } from "./middlewares/user.middleware";
import { ambienteHandler } from "./modules/Ambientes/handlers/ambiente.handler";
import { blocoHandler } from "./modules/Blocos/handlers/bloco.handler";
import { patrimonioHandler } from "./modules/Patrimonio/handlers/patrimonio.handler";
import { movimentacaoHandler } from "./modules/Movimentacao/handlers/movimentacao.handler";

const app = Express();
const handler = new UserHandler();

app.use(Express.json());

// User
app.post('/login', (req, res) => handler.loginUser(req, res));
app.post('/register', (req, res) => handler.createUser(req, res));
app.post('/forgot-password', (req, res) => handler.forgotPassword(req, res));
app.put('/update-password', (req, res) => handler.updatePassword(req, res));
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: "This is a protected route" });
});

// Ambientes
app.get('/ambientes', authMiddleware, (req, res) => ambienteHandler.listarAmbientes(req, res));
app.post('/ambientes', authMiddleware, (req, res) => ambienteHandler.criarAmbiente(req, res));
app.put('/ambientes/:id', authMiddleware, (req, res) => ambienteHandler.atualizarAmbiente(req, res));
app.delete('/ambientes/:id', authMiddleware, (req, res) => ambienteHandler.deletarAmbiente(req, res));

// Blocos
app.get('/blocos', authMiddleware, (req, res) => blocoHandler.listarBlocos(req, res));
app.get('/blocos/:id', authMiddleware, (req, res) => blocoHandler.obterBloco(req, res));
app.post('/blocos', authMiddleware, (req, res) => blocoHandler.criarBloco(req, res));
app.put('/blocos/:id', authMiddleware, (req, res) => blocoHandler.atualizarBloco(req, res));
app.delete('/blocos/:id', authMiddleware, (req, res) => blocoHandler.deletarBloco(req, res));

// Patrimônios
app.get('/patrimonios', authMiddleware, (req, res) => patrimonioHandler.listarPatrimonios(req, res));
app.get('/patrimonios/:id', authMiddleware, (req, res) => patrimonioHandler.obterPatrimonio(req, res));
app.post('/patrimonios', authMiddleware, (req, res) => patrimonioHandler.criarPatrimonio(req, res));
app.put('/patrimonios/:id', authMiddleware, (req, res) => patrimonioHandler.atualizarPatrimonio(req, res));
app.delete('/patrimonios/:id', authMiddleware, (req, res) => patrimonioHandler.deletarPatrimonio(req, res));

// Movimentações
app.get('/movimentacoes', authMiddleware, (req, res) => movimentacaoHandler.listarMovimentacoes(req, res));
app.get('/movimentacoes/:id', authMiddleware, (req, res) => movimentacaoHandler.obterMovimentacao(req, res));
app.post('/movimentacoes', authMiddleware, (req, res) => movimentacaoHandler.criarMovimentacao(req, res));

app.listen(3030, () => console.log("Server is running on port 3030"));