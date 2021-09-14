import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Container, ConteudoTitulo, Titulo, ButtomWarning, BotaoAcao, AlertDanger, AlertSuccess, ButtomInfo, Form, Label, Input, Select } from '../../styles/custom_adm';

import api from '../../config/configApi';

export const Editar = (props) => {

    const [id] = useState(props.match.params.id);
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('');
    const [situacao, setSituacao] = useState('');
    const [dataPagamento, setDataPagamento] = useState('');

    const [valorLancTarge, setValorLancTarge] = useState('');

    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    });

    const converterReal = async (valorLancamentoInput) => {
        var valorLanConvert = valorLancamentoInput.toString().replace(/\D/g, "");
        valorLanConvert = valorLanConvert.replace(/(\d)(\d{2})$/, "$1,$2");
        valorLanConvert = valorLanConvert.replace(/(?=(\d{3})+(\D))\B/g, ".");
        setValorLancTarge(valorLanConvert);

        var valorSalvar = await valorLanConvert.replace(".", "");
        valorSalvar = await valorSalvar.replace(",", ".");
        setValor(valorSalvar);
    }

    const editLancamento = async e => {
        e.preventDefault();

        const headers = {
            'Content-Type': 'application/json'
        }

        await api.put("/editar", { id, nome, valor, tipo, situacao, dataPagamento }, { headers })
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

    useEffect(() => {
        const getLancamento = async () => {
            await api.get("/visualizar/" + id)
                .then((response) => {
                    setNome(response.data.lancamento.nome);
                    setValor(response.data.lancamento.valor);
                    converterReal(response.data.lancamento.valor);
                    setTipo(response.data.lancamento.tipo);
                    setSituacao(response.data.lancamento.situacao);
                    setDataPagamento(moment(response.data.lancamento.dataPagamento).format('YYYY-MM-DD'));
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
        getLancamento();
    }, [id])

    return (
        <Container>
            <ConteudoTitulo>
                <Titulo>Editar</Titulo>
                <BotaoAcao>
                    <Link to="/">
                        <ButtomInfo>Listar</ButtomInfo>
                    </Link>
                </BotaoAcao>
            </ConteudoTitulo>

            {status.type === 'error' ? <AlertDanger>{status.mensagem}</AlertDanger> : ""}
            {status.type === 'success' ? <AlertSuccess>{status.mensagem}</AlertSuccess> : ""}

            <Form onSubmit={editLancamento} >
                <Label>Nome: </Label>
                <Input type="text" name="nome" placeholder="Nome do lançamento" value={nome} onChange={e => setNome(e.target.value)} /> 

                <Label>Valor: </Label>
                <Input type="text" name="valorLancTarge" placeholder="Valor do lançamento" value={valorLancTarge} onChange={e => converterReal(e.target.value)} />

                <Label>Tipo: </Label>
                <Select name="tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="1">Pagamento</option>
                    <option value="2">Recebido</option>
                </Select>

                <Label>Situação: </Label>
                <Select name="situacao" value={situacao} onChange={e => setSituacao(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="1">Pago</option>
                    <option value="2">Pendete</option>
                    <option value="3">Recebido</option>
                </Select>

                <Label>Data de Pagamento: </Label>
                <Input type="date" name="dataPagamento" value={dataPagamento} onChange={e => setDataPagamento(e.target.value)} />

                <ButtomWarning type="submit">Editar</ButtomWarning>
            </Form>
        </Container>
    );
};