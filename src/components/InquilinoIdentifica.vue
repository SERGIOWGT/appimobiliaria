<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <TituloPagina titulo="CONSULTA PARA CADASTRO DE INQUILINO" @cbAnterior="$router.back()" iconBotao=""/>
         <v-card flat class="pt-0 mt-1" tile>
            <v-list three-line>
                <v-subheader class="justify-center px-0">
                    <v-col class="px-1" cols="9"><b>{{tituloLista}}</b></v-col>                    
                    <v-col cols="3" >
                        <v-row justify="end">
                            <v-btn :disabled="somenteConsulta" icon color="primary" @click="novo()"><v-icon>mdi-account-plus-outline</v-icon></v-btn>
                            <v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
                        </v-row>
                    </v-col> 
                </v-subheader>
                <v-divider></v-divider>
                <v-list-item-group v-model="inquilinoIdSelecionado">
                    <v-flex v-for="(item) in resultadoTela" :key="item.id">
                        <v-list-item class="px-1 py-0">
                            <v-list-item-content>
                                <v-row>
                                    <v-col cols="10">
                                        <v-list-item-title v-html="item.nome || ''"></v-list-item-title>
                                        <v-list-item-subtitle v-html="linha(2, item.dataNascimento || '')"></v-list-item-subtitle>
                                        <v-list-item-subtitle v-html="linha(3, item.celular || '') "></v-list-item-subtitle>
                                    </v-col>
                                    <v-col cols="2" >
                                        <v-container class="fill-height" fluid>
                                            <v-row justify="center" align="center">
                                                <v-btn icon color="primary" @click="edita(item.id)"><v-icon>mdi-account-arrow-right-outline</v-icon></v-btn>
                                            </v-row>
                                        </v-container>
                                    </v-col>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                    </v-flex>
                </v-list-item-group>
            </v-list>
            <div class="text-center" v-show="numeroPaginas > 0"><v-pagination v-model="paginaAtual" :length="numeroPaginas" total-visible="6"></v-pagination></div>
        </v-card>
    </v-container>
</template>
<script>
    import TituloPagina from '../components/TituloPagina'
    import {strDateTime2StrDateBr} from '../bibliotecas/formataValores'
   
    const tamanhoPagina = 3;
    export default {
        props: {
            mostra: Boolean, 
            somenteConsulta: Boolean,
            executaRefresh: Boolean
        },
        components: {TituloPagina},
        data() {
            return {
                paginaAtual: 0,
                numeroPaginas: 0,
                
                resultadoTela: [],

                inquilinos: [],

                // funcoes
                inquilinoIdSelecionado: 0
            }
        },
        mounted() {
            this.refresh();
        },
        watch: {
            executaRefresh: function(newVal) {
                if (newVal == true)
                    this.refresh();
            },
            paginaAtual: function (value) {
                if (value <= 0)
                    this.resultadoTela = []
                else {
                    this.resultadoTela = this.inquilinos.slice((value-1) * tamanhoPagina, (value) * tamanhoPagina)
                }
            }
        },
        computed: {
            tituloLista: function() {
                //const _numeroRegistros = this.resultadoTela.length
                const _totalRegistros = this.inquilinos.length

                return (_totalRegistros == 0) ? 'Nenhum inquilino retornado' : (_totalRegistros == 1) ? ` Um inquilino retornado` : ` ${_totalRegistros} inquilinos`
            },
        },
        methods: {
            novo() {
                this.$emit('cbNovo')
            },
            edita(id) {
                this.$emit('cbEdita', id)
            },
            refresh() {
                
                this.inquilinos = this.$store.getters.Inquilinos;
                if (this.inquilinos.length == 0)
                    this.numeroPaginas = this.paginaAtual = 0
                else {
                    this.numeroPaginas = Math.ceil(this.inquilinos.length / tamanhoPagina);
                    this.paginaAtual = 1
                }
            },
            linha(tipo, value){
                if (tipo == 2) {
                    const _dataNascimento = strDateTime2StrDateBr(value, 'yyyy-mm-dd', '-')
                    return `<span class="nota_botao">Nascido em ${_dataNascimento}</span></span> `
                }
                else if (tipo == 3) {
                    const _cpf = (value) ? value.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3') : '' // eslint-disable-line
                    return `Celulares:<span class="nota_botao">&nbsp;${_cpf}</span> `
                }
            },
        }
    }
</script>
<style scoped lang="scss">
    .paragrafo1 {
        padding: 0px;
        margin: 0px;
    }
</style>