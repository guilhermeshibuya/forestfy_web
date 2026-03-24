'use client'

import { getConfidenceLevel } from '@/app/(dashboard)/classification/(utils)/get-confidence-level'
import { ClassificationResponse } from '@/types/classification'
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 16,
    borderBottom: '1px solid #ccc',
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 16,
  },
  image: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    marginTop: 8,
  },
  mainResult: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  highConfidenceBorder: {
    borderLeft: '4px solid #22C55E',
  },
  mediumConfidenceBorder: {
    borderLeft: '4px solid #EAB308',
  },
  lowConfidenceBorder: {
    borderLeft: '4px solid #fb2c36',
  },
  bigText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  table: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eee',
    paddingVertical: 4,
  },
  footer: {
    marginTop: 24,
    fontSize: 10,
    color: '#666',
  },
})

export function ClassificationReport({
  data,
}: {
  data: ClassificationResponse
}) {
  const top = data.predictions[0]
  const confidenceLevel = getConfidenceLevel(top.score)

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/logo_green.png" style={{ width: 100 }} />
          <Text style={styles.title}>Laudo de Identificação de Madeira</Text>
          <Text>ID: {data.classification_id}</Text>
          <Text>
            Data: {new Date(data.classification_date).toLocaleString()}
          </Text>
        </View>

        {/* Image */}
        <View style={styles.section}>
          <Text>Imagem analisada</Text>
          <Image src={data.original_image_url} style={styles.image} />
        </View>

        {/* Main result */}
        <View
          style={[
            styles.mainResult,
            confidenceLevel === 'high'
              ? styles.highConfidenceBorder
              : confidenceLevel === 'medium'
                ? styles.mediumConfidenceBorder
                : styles.lowConfidenceBorder,
          ]}
        >
          <Text style={styles.bigText}>{top.scientific_name}</Text>
          <Text>Confiança: {(top.score * 100).toFixed(2)}%</Text>
        </View>

        {/* Other predictions */}
        <View style={styles.section}>
          <Text>Outras possibilidades</Text>
          <View style={styles.table}>
            {data.predictions.slice(1).map((p, i) => (
              <View style={styles.row} key={i}>
                <Text>{p.scientific_name}</Text>
                <Text>{(p.score * 100).toFixed(2)}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Extra info */}
        <View style={styles.section}>
          <Text>Localização: {data.location ?? 'Não informada'}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Este relatório foi gerado automaticamente por um modelo de
          inteligência artificial e deve ser utilizado como apoio à análise.
        </Text>
      </Page>
    </Document>
  )
}
