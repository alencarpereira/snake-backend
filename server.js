require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS para liberar apenas seu frontend
const corsOptions = {
    origin: 'https://alencarpereira.github.io',
    optionsSuccessStatus: 200
};

// Usa o middleware CORS com as opções configuradas
app.use(cors(corsOptions));

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Conecta ao MongoDB usando URI do .env
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB conectado!'))
    .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// Define o schema da pontuação
const scoreSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    pontuacao: { type: Number, required: true },
    criadoEm: { type: Date, default: Date.now }
});

// Cria o modelo Score com o schema acima
const Score = mongoose.model('Score', scoreSchema);

// Rota para salvar nova pontuação
app.post('/api/scores', async (req, res) => {
    const { nome, pontuacao } = req.body;

    if (!nome || pontuacao == null) {
        return res.status(400).json({ error: 'Nome e pontuação são obrigatórios.' });
    }

    try {
        const novoScore = new Score({ nome, pontuacao });
        await novoScore.save();
        res.status(201).json({ message: 'Pontuação salva com sucesso!', score: novoScore });
    } catch (error) {
        console.error('Erro ao salvar pontuação:', error);
        res.status(500).json({ error: 'Erro ao salvar pontuação.' });
    }
});

// Rota para obter top 5 pontuações ordenadas
app.get('/api/scores/top5', async (req, res) => {
    try {
        const topScores = await Score.find()
            .sort({ pontuacao: -1, criadoEm: 1 }) // maior pontuação primeiro, se empate mais antigo antes
            .limit(5);

        res.json(topScores);
    } catch (error) {
        console.error('Erro ao buscar pontuações:', error);
        res.status(500).json({ error: 'Erro ao buscar pontuações.' });
    }
});

// Rota teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('API rodando. Use /api/scores e /api/scores/top5');
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});




