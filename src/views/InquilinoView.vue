<template>
    <v-container fluid style="height: 100vmax;" class="pa-0">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>  
        <ProgressBar :mensagem="mensagemAguarde"/>          
        <IdentificacaoInquilino 
            v-show="etapaAtual == enumEtapa.emPesquisa"
            :permiteInclusao='permiteInclusao'
            :permiteAlteracao='permiteAlteracao'
            :permiteExclusao='permiteExclusao'
            :executaRefresh='executaRefresh'
            @cbNovo= 'novo'
            @cbEdita='edita'
            @cbMensagemAguarde='cbMensagemAguarde'
            @cbMensagemErro='cbMensagemErro'
            @cbMensagemSucesso='cbMensagemSucesso'
        /> 

        <CadastraInquilino 
            v-if="etapaAtual == enumEtapa.emCadastro"
            :inquilinoId='inquilinoId'
            @cbNovoCadastro='novo'
            @cbFimCadastro='fimCadastro'
            @cbMensagemAguarde='cbMensagemAguarde'
            @cbMensagemErro='cbMensagemErro'
            @cbMensagemSucesso='cbMensagemSucesso'
        />

<!--                 
        <ConsultaCidadao 
            v-if="etapaAtual == enumEtapa.emConsulta"
            :pacienteId='0'
            @cbFimCadastro='fimCadastro'
            @cbMensagemAguarde='cbMensagemAguarde'
            @cbMensagemErro='cbMensagemErro'
            @cbMensagemSucesso='cbMensagemSucesso'
        /> -->
    </v-container>
</template>
<script>
  import {carregaDadosPersistentes} from '../rotinasProjeto/rotinasProjeto'
  import IdentificacaoInquilino from '../components/InquilinoIdentifica';
  import CadastraInquilino from '../components/InquilinoCadastra';
  //import ConsultaCidadao from '../components/CidadaoConsulta';
  import MessageBox from '../lastec.components/lastec-messagebox'
  import ProgressBar from '../lastec.components/lastec-progressbar'
  import {temAcesso} from '../rotinasProjeto/rotinasProjeto'
    
  export default {
      name: 'identificacaoInquilino',
      //components: {IdentificacaoInquilino, CadastraCidadao, MessageBox, ProgressBar, ConsultaCidadao},
      components: {CadastraInquilino, IdentificacaoInquilino, MessageBox, ProgressBar},
      data() {
        return {
          perms: [
              {id:3, tipoId:1, acao:'I'},
              {id:3, tipoId:1, acao:'C'}
          ],
          executaRefresh: false,

          inquilinoId: 0,

          enumEtapa: {
            emPesquisa: 0,
            emCadastro: 1,
            emConsulta: 2
          },
          etapaAtual: 0,

          // dados
          tipoMensagem: 0,
          mensagem: '',
          mensagemAguarde: '',

          // seguranca
          funcionalidadeId: 3,
          permiteInclusao: false,
          permiteExclusao: false,
          permiteAlteracao: false,
          somenteConsulta: false,

        }
      },
      mounted() {
        const _permissionamentos = this.$store.getters.permissionamento;
       
        this.permiteInclusao = temAcesso(_permissionamentos, this.funcionalidadeId, 1, 'I');
        this.permiteAlteracao = temAcesso(_permissionamentos, this.funcionalidadeId, 1, 'A');
        this.permiteExclusao = temAcesso(_permissionamentos, this.funcionalidadeId, 1, 'E');
        this.somenteConsulta = !(this.permiteInclusao || this.permiteAlteracao || this.permiteExclusao);

        this.$store.commit('habilitaUserbar', false)
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
      methods: {
        cbMensagemAguarde(msg) {
          this.mensagemAguarde = msg
        },
        cbMensagemErro(msg) {
          this.tipoMensagem = 1
          this.mensagem = msg
        },
        cbMensagemSucesso(msg) {
          this.tipoMensagem = 0
          this.mensagem = msg
        },
        novo() {
          this.executaRefresh = false;
          this.inquilinoId = 0
          this.etapaAtual = this.enumEtapa.emCadastro
        },
        edita(id) {
          this.executaRefresh = false;
          this.etapaAtual = this.somenteConsulta ? this.enumEtapa.emConsulta : this.enumEtapa.emCadastro
          this.inquilinoId = id
          console.log('edita(id)', id)
        },
        async fimCadastro(volta) {
          if (volta == false) {
            await carregaDadosPersistentes();
            this.executaRefresh = true;
            this.mensagemSucesso = 'Inquilino ' + (this.inquilinoId == 0? 'cadastrado' : 'alterado') + ' com sucesso!' ;
          } 
            
          this.etapaAtual = this.enumEtapa.emPesquisa
        }
      }
  }
</script>
<style scoped>
  .input__label {
    color: blue;
  }
  @media(max-width: 2000px) {
    display-1 {font-size: 0.8rem}
    display-2 {font-size: 0.8rem}
    body-2 {font-size: 0.8rem}
    p {font-size: 0.8rem}
    h2 {font-size: 1.2rem}
    h4 {font-size: 0.9rem}
    .v-text-field input {
      font-size: 5.2em;
    }
    .v-combobox-field {
     font-size: 2.2em;
    }
  }
  .right-input input {
    text-align: right
  }
</style>

