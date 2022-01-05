<template>
	<v-container fluid style="height: 100vmax;" class="pa-1">
		<MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>          
		<ProgressBar :mensagem="mensagemAguarde" />    
		<TituloPagina titulo="MOVIMENTAÇÕES MENSAIS" @cbAnterior="$router.back()" iconBotao=""/>

		<v-bottom-sheet v-model="infoParcela.mostraDialog" inset max-width="500px">
			<v-sheet class="text-center ">
				<v-card tile class="pa-0 ma-0 ">
					<v-card-title class="pa-2 teal lighten-2" >
						<span class="white--text subtitle-1">{{infoParcela.titulo}}</span>
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text class="pa-0">
						<v-form ref="myForm" class="mx-3" v-model="infoParcela.formularioValido">
							<v-text-field class="mt-5 pt-2" 
								dense disabled
								label="Vencimento da Parcela"
								v-model="infoParcela.dataVencimento"
							/>
							<v-text-field class="pt-2" 
								dense disabled
								label="Valor da Parcela"
								v-model="infoParcela.strValorParcela"
							/>
							<v-text-field class="pt-2" 
								dense autofocus required clearable
								label="Data de Pagamento*"
								v-model="infoParcela.dataPagamento"
								v-mask="'##/##/####'"
								:rules="[regras.Data.valida(true)]"
								:disabled="infoParcela.exclusao == true" 
							/>
						</v-form>
					</v-card-text>
					<v-card-actions class="pt-1 px-5 ma-0">
						<v-spacer></v-spacer>
						<v-btn text small color="secundary" @click="infoParcela.mostraDialog = false">Fechar </v-btn>
						<v-btn text small color="error" v-if="infoParcela.exclusao == true" @click="excluiPagamento()">Excluir</v-btn>
						<v-btn text small 
							:disabled="infoParcela.formularioValido == false"
							color="primary" 
							v-if="infoParcela.exclusao == false" 
							@click="salvaOperacao()"
						>Salvar</v-btn>
					</v-card-actions>
				</v-card>
			</v-sheet>
		</v-bottom-sheet>

		<v-flex class="px-5 pt-2">
			<v-row dense class="justify-center white--text teal lighten-2">
				<v-col class="d-flex justify-start" cols="1">
					<v-btn dark :disabled="dataAtual <= menorData" icon v-on:click="subMonth()"><v-icon>mdi-chevron-left</v-icon></v-btn>
				</v-col>
				<v-col class="d-flex justify-center align-center" cols="10"><h4>{{mesAtual}}</h4></v-col>
				<v-col class="d-flex justify-end" cols="1">
					<v-btn dark icon v-on:click="addMonth()"><v-icon>mdi-chevron-right</v-icon></v-btn>
				</v-col>
			</v-row>
		</v-flex>
		<v-row class="d-flex justify-center py-5 px-5">
			<v-chip-group column v-model="filtro" mandatory>
				<v-chip filter outlined>Todos</v-chip>
				<v-chip filter outlined>Desocupados</v-chip>
				<v-chip filter outlined>Não Pagos</v-chip>
				<v-chip filter outlined>Pagos</v-chip>
				<v-chip filter outlined>Recebido pelo Proprietário</v-chip>
			</v-chip-group>
		</v-row>
		<v-divider></v-divider>
		<v-row class="ma-1 my-3">
			<v-col class="px-1" cols="9">{{numeroRegistros()}}</v-col>                    
				<v-col cols="3" >
					<v-row justify="end">
						<v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
					</v-row>
				</v-col> 
			</v-row>
		<v-divider></v-divider>
		<v-flex v-for="(item) in resultadoTela" :key="item.id">
		<v-list-item class="px-1 py-0">
			<v-list-item-content>
				<v-row>
					<v-col cols="10">
						<v-list-item-title v-html="item.nomeImovel || ''"></v-list-item-title>
						<v-flex v-if="item.alugado == false">
							<v-list-item-subtitle class="pa-1 black--text">Imóvel livre</v-list-item-subtitle>
						</v-flex>
						<v-flex v-else>
							<v-list-item-subtitle class="pa-1 black--text">{{item.nomeInquilino || ''}} - {{item.contratoAluguelId}}</v-list-item-subtitle>
							<v-divider></v-divider>
							<v-list-item-subtitle class="pa-1">
								<v-row>
									<v-col cols="4">Parcela: </v-col>
									<v-col>{{linhaParcela(item.dataParcela || '', item.valorParcela || '')}}</v-col>
								</v-row>
							</v-list-item-subtitle>
							<v-list-item-subtitle class="pa-1" v-if="item.pago == true">
								<v-row>
									<v-col cols="4">Pagamento: </v-col>
									<v-col>{{linhaParcela(item.dataPagamento || '', item.valorPago || '')}}</v-col>
								</v-row>

							</v-list-item-subtitle>
						</v-flex>
					</v-col>
					<v-col cols="2" >
						<v-container class="fill-height" fluid>
							<v-row justify="center" align="center">
								<v-btn icon color="primary" v-on:click="novoContrato()" v-if="item.alugado == false" ><v-icon>mdi-file-sign</v-icon></v-btn>
								<v-btn icon color="primary" v-on:click="preparaNovoPagamento(item.parcelaContratoId, item.dataParcela || '', item.valorParcela || '')" else v-if="item.alugado == true && item.pago == false" ><v-icon>mdi-cash-plus</v-icon></v-btn>
								<v-btn icon color="red" v-on:click="preparaExclusaoPagamento(item.recebimentoParcelaId, item.dataParcela || '', item.valorParcela || '', item.dataPagamento || '')" else v-if="item.alugado == true && item.pago == true" ><v-icon>mdi-cash-minus</v-icon></v-btn>
							</v-row>
						</v-container>
					</v-col>
				</v-row>
			</v-list-item-content>
		</v-list-item>
		<v-divider></v-divider>
	</v-flex>

	</v-container>
</template>
<script>
	import mainService from '../services/mainService'
	import TituloPagina from '../components/TituloPagina'
	import MessageBox from '../lastec.components/lastec-messagebox'
	import ProgressBar from '../lastec.components/lastec-progressbar'
	import {strDateTime2StrDateBr, stringDataBr2Sql, data2String} from '../bibliotecas/formataValores'
	import regrasCampos from '../bibliotecas/regrasCampos'
   
	export default {
		components: {TituloPagina, ProgressBar, MessageBox},
		data() {
			return {

				regras: regrasCampos,

				menorData: '',

				enumFiltro: {
					todos: 0,
					imovelLivre: 1,
					somenteNaoPagos: 2,
					somentePagos: 3,
					recebidoPeloProprietario: 4
				},

				dataAtual: '',
				mesAtual: '',
				filtro: 2,
				resultado: [],
				resultadoTela: [],

				tipoMensagem: 0,
				mensagem: '',
				mensagemAguarde: '',

				dataBrUltimoPgto: '',

				infoParcela: {
					titulo: '',
					exclusao: false,
					mostraDialog: false,
					formularioValido: false,
					id: 0,
					recebimentoParcelaId: 0,
					dataVencimento: '',
					valorParcela: 0,
					strValorParcela: '',
					dataPagamento: ''                },
			}
		},
		created() {
			const _hoje = new Date();
			this.dataAtual = new Date(_hoje.getFullYear(), _hoje.getMonth(), 1);
			this.menorData = new Date(2021, 10, 1);
		},
		mounted() {
			this.refresh();

		},
		computed: {
			mensagemErro: {
				get: function() { return this.mensagem},
				set: function(val) {
					this.tipoMensagem = 1
					this.mensagem = val
				}
			},
			mensagemSucesso: {
				get: function() { return this.mensagem},
				set: function(val) {
					this.tipoMensagem = 0
					this.mensagem = val
				}
			},
		},
		watch: {
			dataAtual(val) {
				const _meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
				this.mesAtual = `${_meses[val.getMonth()]} de ${val.getFullYear()}`
			},
			filtro() {
				this.filtra();
			}
		},
		methods: {
			addMonth() {
				this.dataAtual = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth() + 1, 1);
				this.refresh()
			},
			async excluiPagamento() {
				
				this.mensagemAguarde='Excluindo pagamento. Aguarde...'
				let _erro = false;
				const _resp = await mainService.excluiPagamentoParcela(this.infoParcela.recebimentoParcelaId)
				.catch(response => {
				this.mensagemAguarde = '';
					_erro = true;
					this.mensagemErro = mainService.catchPadrao(response);
				})
				if (_erro) {
					return;
				}
				this.mensagemAguarde = '';
				console.log(_resp)
				if (_resp.status != 204) { 
					this.mensagemErro = _resp.message;
					return 
				}
				this.mensagemSucesso = 'Parcela paga com sucesso';
				this.infoParcela.mostraDialog = false;
				this.refresh();
			},
			filtra() {
				if (this.filtro == this.enumFiltro.todos) {
					this.resultadoTela = this.resultado;
					return;
				}

				if (this.filtro == this.enumFiltro.imovelLivre) {
					this.resultadoTela = this.resultado.filter((p) => p.alugado === false);
					return;
				}
				if (this.filtro == this.enumFiltro.somenteNaoPagos) {
					this.resultadoTela = this.resultado.filter((p) => p.alugado === true && p.pago === false && p.recebidoPeloProprietario == false) ;
					return;
				}
				if (this.filtro == this.enumFiltro.somentePagos) {
					this.resultadoTela = this.resultado.filter((p) => p.alugado === true && p.pago === true &&  p.recebidoPeloProprietario == false) ;
					return;
				}

				if (this.filtro == this.enumFiltro.recebidoPeloProprietario) {
					this.resultadoTela = this.resultado.filter((p) => p.recebidoPeloProprietario == true);
					return;
				}
			},
			linha(tipo, val1){
				if (tipo == 2) {
					const _vencimento = strDateTime2StrDateBr(val1, 'yyyy-mm-dd', '-')
					return `<span class="nota_botao">Em ${_vencimento} </span></span> `
				}
				else if (tipo == 3) {
					const _cpf = (val1) ? value.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3') : '' // eslint-disable-line
					return `Celulares:<span class="nota_botao">&nbsp;${_cpf}</span> `
				}
			},
			linhaParcela(data, valor) {
				if (!data) {
					return '';
				}
				
				const _vencimento = strDateTime2StrDateBr(data, 'yyyy-mm-dd', '-')
				const _retorno = _vencimento + ' - ' + valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

				return `${_retorno}`
			},
			linhaPagamento(data, valorPagamento, valorTxAdm) {
				if (!data) {
					return '';
				}
				
				const _vencimento = strDateTime2StrDateBr(data, 'yyyy-mm-dd', '-')
				const _retorno = _vencimento + ' - ' + valorPagamento.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) 
					+ ' - ' + valorTxAdm.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

				return `<span class=""><b>Pago: </b> ${_retorno} </span></span> `
			},
			novoContrato() {
				this.mensagemErro = 'Novo Contrato de Aluguel não implementada'
			},
			numeroRegistros: function() {
                const _totalRegistros = this.resultadoTela.length
				if (_totalRegistros == 0) {
					return 'Nenhum imóvel'
				}

				if (_totalRegistros == 1) {
					const _valor = this.resultadoTela.reduce((a, b) => +a + +b.valorParcela, 0);
					return ' 1 imóvel '  + (_valor == 0 ? '' :  ` - ${_valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`);
				}
				const _valor = this.resultadoTela.reduce((a, b) => +a + +b.valorParcela, 0);
				return ` ${_totalRegistros} imóveis ` + (_valor == 0 ? '' :  ` - ${_valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`);
            },
			preparaExclusaoPagamento(recebimentoParcelaId, dataParcela, valorParcela, dataPagamento) {
				this.infoParcela.titulo = 'Exclui Pagamento';
				this.infoParcela.mostraDialog = true;
				this.infoParcela.exclusao = true;
				this.infoParcela.recebimentoParcelaId = recebimentoParcelaId;
				this.infoParcela.dataVencimento = strDateTime2StrDateBr(dataParcela, 'yyyy-mm-dd', '-');
				this.infoParcela.strValorParcela = valorParcela.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
				this.infoParcela.dataPagamento = strDateTime2StrDateBr(dataPagamento, 'yyyy-mm-dd', '-');
			},
			preparaNovoPagamento(parcelaId, dataParcela, valorParcela) {
				this.infoParcela.titulo = 'Quitação de Parcela';
				this.infoParcela.mostraDialog = true;
				this.infoParcela.exclusao = false;
				this.infoParcela.id = parcelaId;
				this.infoParcela.dataVencimento = strDateTime2StrDateBr(dataParcela, 'yyyy-mm-dd', '-');
				this.infoParcela.valorParcela = valorParcela;
				this.infoParcela.strValorParcela = valorParcela.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
				this.infoParcela.dataPagamento = (this.dataBrUltimoPgto) ? this.dataBrUltimoPgto : data2String(new Date(), 'BR');
			},
			async refresh() {
				const _ano = this.dataAtual.getFullYear();
				const _mes = this.dataAtual.getMonth()+1;
				let _retorno = ''

				this.mensagemAguarde =  'Buscando movimentação do mês! Aguarde...'
				let resp = await mainService.listaMovimentacaoMensal(_ano, _mes)
					.catch(
						err => {
							_retorno =  'ERR:3320-' + mainService.catchPadrao(err)
					});

				console.log(resp.data)

				this.mensagemAguarde =  '';
				if (_retorno) {
					this.mensagemErro = _retorno;
					return;
				}
				this.resultado = resp.data

				this.filtra();
			},
			salvaOperacao() {
				if (this.infoParcela.exclusao) {
					this.excluiPagamento()
					return;
				}
				
				this.salvaPagamento()
			},
			async salvaPagamento() {                        
				this.mensagemAguarde='Salvando o pagamento. Aguarde...'
				let _erro = ''
				const _data = stringDataBr2Sql(this.infoParcela.dataPagamento);
				const _param = {
					parcelaContratoId: this.infoParcela.id,
					valor: this.infoParcela.valorParcela,
					data: _data
				}

				const _resp = await mainService.salvaPagamentoParcela(_param)
				.catch(response => {
					_erro = mainService.catchPadrao(response)
				})

				this.mensagemAguarde = '';
				if (_erro) {
					this.mensagemErro = _erro;
					return;
				}
				console.log(_resp)
				if (_resp.status != 204) { 
					this.mensagemErro = _resp.message;
					return 
				}
				this.dataBrUltimoPgto = this.infoParcela.dataPagamento;
				this.mensagemSucesso = 'Parcela paga com sucesso';
				this.infoParcela.mostraDialog = false;
				this.refresh();
			},
			subMonth() {
				this.dataAtual = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth() - 1, 1);
				this.refresh()
			},
		}
	}
</script>
<style scoped>
  .linha{
	justify-items: center;
	width: 90%;
  } 
 
  .botao-arredondado{
	width: 90%;
	border-radius:10px!important;
  } 
</style>