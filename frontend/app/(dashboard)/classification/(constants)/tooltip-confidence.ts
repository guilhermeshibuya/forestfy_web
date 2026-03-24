import { ConfidenceLevel } from '../(types)/confidence-level'

export const TOOLTIP_CONFIDENCE_MESSAGES: { [key in ConfidenceLevel]: string } =
  {
    high: 'A confiança é uma medida de quão certo o modelo está sobre a correspondência. Valores mais altos indicam maior certeza. No entanto, mesmo uma correspondência com alta confiança pode ser incorreta, então é sempre bom verificar as informações adicionais sobre a espécie.',
    medium:
      'A confiança é moderada, o modelo tem alguma certeza sobre a correspondência, mas pode haver outras possibilidades. Considere verificar as informações adicionais sobre a espécie e comparar com outras correspondências.',
    low: 'A confiança é baixa, o modelo não tem certeza sobre a correspondência. É importante verificar as informações adicionais sobre a espécie e considerar outras correspondências possíveis. Possivelmente o sistema não conhece a espécie ou a imagem tem baixa qualidade.',
  }
