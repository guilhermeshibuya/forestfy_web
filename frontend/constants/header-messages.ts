import { APP_ROUTES } from '@/constants/app-routes'

export const HEADER_MESSAGES = [
  {
    match: (path: string) => path === APP_ROUTES.DASHBOARD,
    title: `Bem-vindo de volta, `,
    description: 'Aqui está um resumo das suas atividades recentes',
  },
  {
    match: (path: string) => path === APP_ROUTES.CLASSIFICATION,
    title: 'Classificação de imagens',
    description: 'Faça o upload de imagens para classificação e análise',
  },
  {
    match: (path: string) => path.startsWith(APP_ROUTES.CLASSIFICATION_RESULTS),
    title: 'Resultados da classificação',
    description: 'Veja os resultados detalhados da sua classificação',
  },
  {
    match: (path: string) => path === APP_ROUTES.SEGMENTATION,
    title: 'Segmentação de imagens',
    description: 'Faça o upload de uma imagem para segmentação',
  },
  {
    match: (path: string) => path === APP_ROUTES.CATALOG,
    title: 'Catálogo de espécies',
    description:
      'Explore as espécies disponíveis no nosso catálogo e suas características',
  },
  {
    match: (path: string) => path === APP_ROUTES.HISTORY,
    title: 'Histórico de atividades',
    description:
      'Revise suas atividades passadas e resultados de classificações',
  },
  {
    match: (path: string) => path === APP_ROUTES.SETTINGS,
    title: 'Configurações da conta',
    description: 'Gerencie suas preferências e informações de conta',
  },
]
