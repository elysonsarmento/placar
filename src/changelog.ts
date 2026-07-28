export const APP_VERSION = '1.4.1-beta';

export const CHANGELOG = [
  {
    version: '1.4.1-beta',
    date: '28/07/2026 às 12:40',
    features: [
      'Reset Simplificado de Pontos: O botão "Sim, Zerar" agora zera apenas a pontuação dos times no set atual sem salvar registros desnecessários no histórico',
      'Modal de Confirmação Limpo: Removido o botão "Apenas reiniciar" e simplificada a confirmação para 2 botões diretos (Cancelar / Sim, Zerar)'
    ]
  },
  {
    version: '1.4.0-beta',
    date: '28/07/2026 às 12:28',
    features: [
      'Efeitos Sonoros Integrados (Web Audio API): Sons instantâneos de ponto (+1) e subtração (-1) sem necessidade de download ou arquivos de áudio externos',
      'Apito de Juiz Sintetizado: Apito de árbitro realista ao fechar sets, encerrar partidas ou finalizar o cronômetro',
      'Locutor por Voz em Português (Web Speech API): Opção de narração audível do placar e avisos em pt-BR ("Dois a Um", "Fim de Set")',
      'Painel de Configuração de Sons: Novos seletores na aba de Regras para ativar/desativar cada efeito sonoro individualmente'
    ]
  },
  {
    version: '1.3.1-beta',
    date: '28/07/2026 às 12:23',
    features: [
      'Fixação dos Botões (-) nos Cantos Externos da Tela: Garantido que os botões de diminuir ponto fiquem permanentemente nos cantos extremos externos (esquerda/direita da tela), mesmo após trocar de lado a quadra'
    ]
  },
  {
    version: '1.3.0-beta',
    date: '28/07/2026 às 12:20',
    features: [
      'Menu Central Vertical (Em pé): A pílula de botões flutuantes voltou a ser exibida na vertical conforme solicitado',
      'Correção da Troca de Lados: Resolvido o bug de dupla inversão que impedia a troca visual dos times e placares ao clicar no botão'
    ]
  },
  {
    version: '1.2.9-beta',
    date: '26/07/2026 às 16:55',
    features: [
      'Posição Fixa dos Botões (-): Botões de diminuir ponto mantidos fixos em seus lados da tela, mesmo ao inverter lados da quadra',
      'Navegação Vertical no Modal de Configurações: Sidebar de configurações mantida estritamente na vertical em todas as resoluções',
      'Linha do Tempo Sob os Botões (-): Sequência de pontos e rodapé posicionados na camada inferior por baixo dos botões de diminuir'
    ]
  },
  {
    version: '1.2.8-beta',
    date: '26/07/2026 às 16:52',
    features: [
      'Eliminação da Sobreposição da UI: Menu central flutuante padronizado como pílula horizontal (42px de altura)',
      'Espaçamento Limpo: Linha do tempo de pontos e histórico de sets no rodapé totalmente visíveis e desobstruídos em todas as resoluções móbiles'
    ]
  },
  {
    version: '1.2.7-beta',
    date: '26/07/2026 às 16:40',
    features: [
      'Análise e Ajuste Visual de Cores: Marcadores de sets no topo agora seguem estritamente as cores dos seus respectivos times',
      'Ergonomia Móbile: Botões (-) fixados nos cantos inferiores externos para fácil alcance sem cobrir os pontos',
      'Compatibilidade HTTP Móvel: Substituição do crypto.randomUUID para permitir testes sem restrição de HTTPS em redes locais'
    ]
  },
  {
    version: '1.2.6',
    date: '26/07/2026',
    features: [
      'Otimização de Dependências: Removidos pacotes não utilizados (@google/genai, express, dotenv, tsx)',
      'Organização do Projeto: Dependências essenciais consolidadas e estrutura do package.json limpa'
    ]
  },
  {
    version: '1.2.5',
    date: '18/04/2026',
    features: [
      'Histórico em Configurações: O histórico de partidas foi movido para uma aba dedicada nas configurações para um placar mais limpo',
      'Visualização Detalhada: O novo histórico em configurações permite ver data, hora e placar de cada set de jogos passados',
      'Placar Minimalista: O rodapé do placar agora mostra apenas os sets da partida atual se necessário'
    ]
  },
  {
    version: '1.2.4',
    date: '18/04/2026',
    features: [
      'Nova opção de Reset: Agora você pode escolher entre "Zerar e Salvar" ou "Apenas Reiniciar" sem sujar o histórico',
      'Controle de Histórico: Adicionado botão de lixeira diretamente no rodapé para limpar partidas passadas',
      'Interface Clara: Rótulos melhorados no histórico inferior para diferenciar "Sets Atuais" de "Partidas Passadas"'
    ]
  },
  {
    version: '1.2.3',
    date: '18/04/2026',
    features: [
      'Revisão visual: Cores e gradients revertidos para o estilo clássico a pedido do usuário',
      'Manutençao: Efeitos de animação e transições suaves preservados'
    ]
  },
  {
    version: '1.2.2',
    date: '09/04/2026',
    features: [
      'Redesign completo do placar: novos cards de pontuação com profundidade visual',
      'Indicador de Saque: agora é possível marcar qual time está sacando',
      'Animações suaves nas mudanças de pontuação',
      'Gradients dinâmicos nos fundos dos times para maior contraste e modernidade',
      'Botão de "Definir Saque" acessível ao passar o mouse/tocar no nome do time'
    ]
  },
  {
    version: '1.2.1',
    date: '09/04/2026',
    features: [
      'Redesign completo do menu de configurações com navegação por abas (Partida, Times, Regras, Sistema)',
      'Melhoria visual em todos os componentes de interface (inputs, botões, cards)',
      'Otimização do layout para tablets e dispositivos móveis',
      'Novas animações de transição entre seções de configuração'
    ]
  },
  {
    version: '1.2.0',
    date: '08/04/2026',
    features: [
      'Adicionado Cronômetro (Progressivo e Regressivo) com controle de pausa e reset',
      'Novo layout do topo: Cronômetro integrado entre os placares de sets',
      'Correção de centralização: Linha divisória e botões agora ficam perfeitamente no centro da tela',
      'Opção de configurar duração do tempo nas regras da partida'
    ]
  },
  {
    version: '1.1.9',
    date: '06/04/2026',
    features: [
      'Correção do bug de fechamento duplo de set (debounce no botão)',
      'Nova opção "Vantagem (2 pontos)" nas configurações',
      'Melhoria na lógica de "Travar Placar no Set" para respeitar a vantagem',
      'Correção da persistência offline e limpeza total do torneio',
      'Atualização do ambiente de deploy para Node.js 24'
    ]
  },
  {
    version: '1.1.8',
    date: '05/04/2026',
    features: [
      'Visual revertido para o layout clássico com os sets no topo e histórico embaixo',
      'Adicionado Histórico de Torneio: agora o aplicativo salva o histórico de partidas anteriores',
      'Nova opção nas configurações para alternar entre "Sets da Partida Atual" e "Partidas Anteriores" no histórico inferior',
      'O histórico de partidas mostra as cores e pontuações dos times que jogaram'
    ]
  },
  {
    version: '1.1.7',
    date: '05/04/2026',
    features: [
      'Novo layout do placar: Nomes dos times agora ficam sempre visíveis no topo',
      'Novo layout do placar: Contagem de sets movida para a parte inferior para maior clareza',
      'Removido o histórico de sets que causava confusão visual'
    ]
  },
  {
    version: '1.1.6',
    date: '05/04/2026',
    features: [
      'Atualização do Vite para a versão mais recente (v8)',
      'Resolução de conflitos de dependências do PWA utilizando overrides no package.json'
    ]
  },
  {
    version: '1.1.5',
    date: '05/04/2026',
    features: [
      'Adicionado botão para buscar e instalar atualizações manualmente na tela de configurações',
      'Correção de conflitos de dependências que causavam erro no GitHub Actions'
    ]
  },
  {
    version: '1.1.4',
    date: '05/04/2026',
    features: [
      'Atualização de todos os pacotes e dependências do sistema para as versões mais recentes',
      'Melhorias de performance e segurança'
    ]
  },
  {
    version: '1.1.3',
    date: '04/04/2026',
    features: [
      'Correção: Botões de editar e excluir times agora estão sempre visíveis (melhoria para telas touch/iPad)'
    ]
  },
  {
    version: '1.1.2',
    date: '04/04/2026',
    features: [
      'Forçado modo tela cheia (fullscreen) no PWA para remover barras do sistema',
      'Ajuste agressivo de altura (100vh) para cobrir a safe area inferior'
    ]
  },
  {
    version: '1.1.1',
    date: '04/04/2026',
    features: [
      'Ajuste na altura da tela para preencher a área segura (safe area) em dispositivos iOS',
      'Correção da barra de rolagem (scrollbar) no tema escuro',
      'Reorganização do layout da tela de configurações em duas colunas'
    ]
  },
  {
    version: '1.1.0',
    date: '04/04/2026',
    features: [
      'Atualização automática do PWA ativada',
      'Nova tela de "Novidades" para ver as atualizações',
      'Opção de manter a tela sempre ligada (Wake Lock)',
      'Botão central para troca rápida de lados da quadra',
      'Inversão automática dos times ao girar o iPad'
    ]
  },
  {
    version: '1.0.0',
    date: '03/04/2026',
    features: [
      'Lançamento inicial do Placar Pro',
      'Controle de pontos e sets',
      'Cores personalizadas para os times',
      'Suporte a tela cheia (PWA)'
    ]
  }
];
