import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Container, ConteudoTitulo, Titulo, ButtomSuccess, BotaoAcao, AlertDanger, AlertSuccess, ButtomInfo, Form, Label, Input, Select } from '../../styles/custom_adm';

import api from '../../config/configApi';

export const Cadastrar = () => {

    const [lancamento, setLancamento] = useState({
        nome: '',
        valor: '',
        tipo: '',
        situacao: '',
        dataPagamento: ''
    });

    const [valorLancTarget, setValorLancTarget] = useState('');

    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    });

    const valorInput = e => setLancamento({ ...lancamento, [e.target.name]: e.target.value });

    const valorLancamento = async e => {
        var valorLancamentoInput = e.target.value;
        console.log(valorLancamentoInput);

        valorLancamentoInput = valorLancamentoInput.replace(/\D/g, "");
        valorLancamentoInput = valorLancamentoInput.replace(/(\d)(\d{2})$/, "$1,$2");
        valorLancamentoInput = valorLancamentoInput.replace(/(?=(\d{3})+(\D))\B/g, ".");

        console.log(valorLancamentoInput);
        setValorLancTarget(valorLancamentoInput);

        var valorSalvar = await valorLancamentoInput.replace(".", "");
        valorSalvar = await valorSalvar.replace(",", ".");

        setLancamento({ ...lancamento, valor: valorSalvar });
    }

    const cadLancamento = async e => {
        e.preventDefault();

        console.log(lancamento.valor);
        const headers = {
            'Content-Type': 'application/json'
        }

        await api.post("/cadastrar", lancamento, { headers })
            .then((response) => {
                setStatus({
                    type: 'success',
                    mensagem: response.data.mensagem
                });
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'error',
                        mensagem: err.response.data.mensagem
                    });
                } else {
                    setStatus({
                        type: 'error',
                        mensagem: "Erro: Tente mais tarde!"
                    });
                }
            });

    }

    return (
        <Container>
            <ConteudoTitulo>
                <Titulo>Cadastrar</Titulo>
                <BotaoAcao>
                    <Link to="/">
                        <ButtomInfo>Listar</ButtomInfo>
                    </Link>
                </BotaoAcao>
            </ConteudoTitulo>

            {status.type === 'error' ? <AlertDanger>{status.mensagem}</AlertDanger> : ""}
            {status.type === 'success' ? <AlertSuccess>{status.mensagem}</AlertSuccess> : ""}

            <Form onSubmit={cadLancamento}>
                <Label>Nome: </Label>
                <Input type="text" name="nome" placeholder="Nome do lançamento" onChange={valorInput} />

                <Label>Valor: </Label>
                <Input type="text" name="valor" placeholder="Valor do lançamento" value={valorLancTarget} onChange={valorLancamento} />

                <Label>Tipo: </Label>
                <Select name="tipo" onChange={valorInput}>
                    <option value="">Selecione</option>
                    <option value="1">Pagamento</option>
                    <option value="2">Recebido</option>
                </Select>

                <Label>Situação: </Label>
                <Select name="situacao" onChange={valorInput}>
                    <option value="">Selecione</option>
                    <option value="1">Pago</option>
                    <option value="2">Pendete</option>
                    <option value="3">Recebido</option>
                </Select>

                <Label>Data de Pagamento: </Label>
                <Input type="date" name="dataPagamento" onChange={valorInput} />

                <ButtomSuccess type="submit">Cadastrar</ButtomSuccess>

            </Form>
        </Container>
    )
}