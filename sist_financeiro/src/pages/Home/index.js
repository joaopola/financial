import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Container, ConteudoTitulo, Titulo, ButtomSuccess, BotaoAcao, AnteriorProximo, ButtomPrimary, Table, TextDanger, TextSuccess, AlertDanger, AlertSuccess, ButtomWarning, ButtomDanger } from '../../styles/custom_adm';

import api from '../../config/configApi';

export const Home = () => {

    const [data, setData] = useState([]);
    const [saldo, setSaldo] = useState("");
    const [valorPago, setValorPago] = useState("");
    const [valorRecebido, setValorRecebido] = useState("");

    var dataAtual = new Date();
    var ano = dataAtual.getFullYear();
    var mes = dataAtual.getMonth() + 1;
    //console.log(mes + "/" + ano);

    const [dataView, setDataView] = useState({
        ano,
        mes
    });

    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    });

    const anterior = async () => {
        if (dataView.mes === 1) {
            ano = dataView.ano - 1;
            mes = 12;
            setDataView({
                ano,
                mes
            });
            listarExtrato(mes, ano);
        } else {
            ano = dataView.ano;
            mes = dataView.mes - 1;
            setDataView({
                ano,
                mes
            });
            listarExtrato(mes, ano);
        }
    };

    const proximo = async () => {
        if (dataView.mes === 12) {
            ano = dataView.ano + 1;
            mes = 1;
            setDataView({
                ano,
                mes
            });
            listarExtrato(mes, ano);
        } else {
            ano = dataView.ano;
            mes = dataView.mes + 1;
            setDataView({
                ano,
                mes
            });
            listarExtrato(mes, ano);
        }
    }

    const listarExtrato = async (mes, ano) => {

        if ((mes === undefined) && (ano === undefined)) {
            var dataAtual = new Date();
            ano = dataAtual.getFullYear();
            mes = dataAtual.getMonth() + 1;
        }

        await api.get("/listar/" + mes + "/" + ano)
            .then((response) => {
                setData(response.data.lancamentos);
                setSaldo(response.data.saldo);
                setValorPago(response.data.valorPagamentos);
                setValorRecebido(response.data.valorRecebido);
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'erro',
                        mensagem: err.response.data.mensagem
                    });
                } else {
                    setStatus({
                        type: 'erro',
                        mensagem: 'Erro: Tente mais tarde!'
                    });
                }
            });
    }

    const apagarLancamento = async (idLancamento) =>{

        const headers = {
            'Content-Type': 'application/json'
        }

        await api.delete("/apagar/" + idLancamento, {headers})
        .then((response) => {
            setStatus({
                type: 'success',
                mensagem: response.data.mensagem
            });
            listarExtrato();
        }).catch((err) => {
            if(err.response){
                setStatus({
                    type: 'erro',
                    mensagem: err.response.data.mensagem
                });
            }else{
                setStatus({
                    type: 'erro',
                    mensagem: "Erro: Tente mais tarde!"
                });
            }
        });
    }

    useEffect(() => {
        listarExtrato();
    }, []);

    return (
        <Container>
            <ConteudoTitulo>
                <Titulo>Listar Situação Financeira</Titulo>
                <BotaoAcao>
                    <Link to="/cadastrar">
                        <ButtomSuccess>Cadastrar</ButtomSuccess>
                    </Link>
                </BotaoAcao>
            </ConteudoTitulo>

            {status.type === 'erro' ? <AlertDanger>{status.mensagem}</AlertDanger> : ""}
            {status.type === 'success' ? <AlertSuccess>{status.mensagem}</AlertSuccess> : ""}

            <AnteriorProximo>
                <ButtomPrimary type="button" onClick={() => anterior()}>Anterior</ButtomPrimary>
                <span>{dataView.mes + "/" + dataView.ano}</span>
                <ButtomPrimary type="button" onClick={() => proximo()}>Próximo</ButtomPrimary>
            </AnteriorProximo>

            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Situação</th>
                        <th>Data</th>
                        <th>Valor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nome}</td>
                            <td>{item.tipo === 1 ? <TextDanger>Pagamento</TextDanger> : <TextSuccess>Recebido</TextSuccess>}</td>
                            <td>
                                {item.situacao === 1 ? <TextSuccess>Pago</TextSuccess> : ""}
                                {item.situacao === 2 ? <TextDanger>Pendente</TextDanger> : ""}
                                {item.situacao === 3 ? <TextSuccess>Recebido</TextSuccess> : ""}
                            </td>
                            <td>{moment(item.dataPagamento).format('DD/MM/YYYY')}</td>
                            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}</td>
                            <td>
                                <Link to={"/editar/" + item.id}>
                                    <ButtomWarning>Editar</ButtomWarning>
                                </Link>{" "}
                                <Link to="#">
                                    <ButtomDanger onClick={() => apagarLancamento(item.id)}>Apagar</ButtomDanger>
                                </Link>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>Saldo</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldo)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Valor Pago</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorPago)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Valor Recebido</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorRecebido)}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </Table>
        </Container>
    );
};