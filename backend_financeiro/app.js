const express = require('express');
const { Op } = require('sequelize');

const cors = require('cors');
const app = express();

const Lancamentos = require('./models/Lancamentos');

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT', POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    next();
})


app.get('/listar/:mes/:ano', async (req, res) => {
    var mes = new Number(req.params.mes);
    var ano = new Number(req.params.ano);
    //console.log("Mes: " + mes + " Ano: " + ano);

    const date = new Date(ano + "-" + mes);
    var primeiroDia = new Date(date.getFullYear(), date.getMonth(), 1);
    var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    //console.log("Primeiro dia do mês: " + primeiroDia);
    //console.log("Último dia do mês: " + ultimoDia);

    const lancamentos = await Lancamentos.findAll({
        order: [['dataPagamento','ASC']],
        where: {
            "dataPagamento": {
                [Op.between]: [primeiroDia, ultimoDia],
            }
        }
    });

    const valorPagamentos = await Lancamentos.sum('valor', {
        where: {
            tipo: '1',
            "dataPagamento": {
                [Op.between]: [primeiroDia, ultimoDia],
            }
        }
    });

    const valorRecebido = await Lancamentos.sum('valor', {
        where: {
            tipo: '2',
            "dataPagamento": {
                [Op.between]: [primeiroDia, ultimoDia],
            }
        }
    });

    const saldo = new Number(valorRecebido) - new Number(valorPagamentos);

    return res.json({
        erro: false,
        lancamentos,
        valorPagamentos,
        valorRecebido,
        saldo
    });
});

app.get('/visualizar/:id', async (req, res) => {
    await Lancamentos.findByPk(req.params.id).then(lancamento => {
        return res.json({
            erro: false,
            lancamento
        });
    }).catch(function(){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Lançamento não encontrado"
        });
    });
});

app.post('/cadastrar', async (req, res) => {
    await Lancamentos.create(req.body).then(function(){
        return res.json({
            erro: false,
            mensagem: "Lançamento cadastrado com sucesso!"
        });
    }).catch(function(){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Lançamento não cadastrado com sucesso!"
        });
    });
});

app.put('/editar', async (req, res) => {
    var dados = req.body;
    await Lancamentos.update(dados, {where: {id: dados.id}}).then(function(){
        return res.json({
            erro: false,
            mensagem: "Lançamento editado com sucesso!"
        });
    }).catch(function(){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Lançamento não editado com sucesso!"
        });
    });

});

app.delete("/apagar/:id", async (req, res) => {
    await Lancamentos.destroy({where: {id: req.params.id}}).then(function(){
        return res.json({
            erro: false,
            mensagem: "Lançamento apagado com sucesso!"
        });
    }).catch(function(){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Lançamento não apagado com sucesso!"
        });
    });
})

app.listen(8081, function(){
    console.log("Servidor iniciado na porta 8081: http://localhost:8081");
});