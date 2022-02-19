import sso from './ssoService'
import api from './apiService'
import store from '../store'

//const signKey = process.env.VUE_APP_SIGN_KEY
export default {
    async listaInquilinos() {
        const _lista = store.getters.inquilinos || [];

        if (_lista.length > 0) {
            console.log(`inquilinos from cache`)
            return new Promise(function(resolve) {
                let resp = {status: 200, data: _lista}
                resolve(resp);
            });
        }
        const ret = await api.listaInquilinos(store.getters.apiToken);
        return ret;
    },
    async listaImoveis() {
        const _lista = store.getters.imoveis || [];

        if (_lista.length > 0) {
            console.log(`imoveis from cache`)
            return new Promise(function(resolve) {
                let resp = {status: 200, data: _lista}
                resolve(resp);
            });
        }
        const ret = await api.listaImoveis(store.getters.apiToken);
        return ret;
    },
    async listaImoveisCompleta() {
        const ret = await api.listaImoveisCompleta(store.getters.apiToken);
        return ret;
    },
    listaPermissionamento: (token, usuarioId, sistemaId) => {
        return sso.listaPermissionamento(token, usuarioId, sistemaId);
    },
    async listaMovimentacaoMensal(ano, mes) {
        const ret = await api.listaMovimentacaoMensal(store.getters.apiToken, ano, mes);
        return ret;
    },

    // Exclui
    async excluiPagamentoParcela (pagamentoId) {
        const _token = store.getters.apiToken;
        return api.excluiPagamentoParcela(_token, pagamentoId);
    },
    async excluiQuitacaoRecebimento (recebimentoParcelaId) {
        const _token = store.getters.apiToken;
        return api.excluiQuitacaoRecebimento(_token, recebimentoParcelaId);
    },

    // SALVA
    async salvaQuitacaoRecebimento (param) {
        const _token = store.getters.apiToken;
        return api.salvaQuitacaoRecebimento(_token, param);
    },
    async salvaInquilino (id, param) {
        const _token = store.getters.apiToken;
        return api.salvaInquilino(_token, id, param);
    },
    async salvaPagamentoParcela (param) {
        const _token = store.getters.apiToken;
        return api.salvaPagamentoParcela(_token, param);
    },

    // OUTROS
    async temAcesso (funcionalidadeId, tipoFuncionalidadeId, acao) {
        var _busca = function (linha) {
            var _retorno = false;
            
            if ((linha.funcionalidadeId === funcionalidadeId) && 
                (linha.tipoFuncionalidadeId === tipoFuncionalidadeId)) {

                //Cadastro
                if (linha.tipoFuncionalidadeId == 1)
                { 
                    switch (acao)
                    {
                        case 'C':
                            _retorno = (linha.consulta === 'S' ? true : false);
                            break;
                        case 'A':
                            _retorno = (linha.alteracao === 'S' ? true : false);
                            break;
                        case 'I':
                            _retorno = (linha.inclusao === 'S' ? true : false);
                            break;
                        case 'E':
                            _retorno = (linha.exclusao === 'S' ? true : false);
                            break;
                        default:
                            _retorno = false;
                    }
                } else 
                    _retorno = true;
            }
            return _retorno
        }

        const _array = store.getters.permissionamento
        var _item = _array.find(_busca)
        return !(_item == null) 
    },
    catchPadrao: (response) => {
        let mensagemErro = ''
        if (response) {
            if (response.erros) {
                let _mensagem = ""
                response.erros.forEach(el => {
                    _mensagem += el.mensagem
                });
                mensagemErro=_mensagem
            }
            else
                mensagemErro=response.message

        } else {
            mensagemErro=response.message
        }
        return mensagemErro;
    }
}