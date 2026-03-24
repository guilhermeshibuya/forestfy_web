import asyncio
import os
from sqlalchemy.future import select

from app.db.session import get_async_session
from app.db.models import Species, SpeciesImage, SpeciesPopularName
from app.services.ml.id2label import ID2LABEL
from app.core.storage import upload_local_file_to_s3
from pathlib import Path
from slugify import slugify


POPULAR_NAMES_MAP = {
    'Acrocarpus fraxinifolius': ["Cedro-indiano", "Acrocarpo", "Cedro rosado"],
    'Amburana acreana': ["Cerejeira", "Cerejeira-da-amazônia", "Amburana", "Cumaru-de-cheiro"],
    'Anacardium giganteum': ["Cajuaçu", "Cajueiro", "Caju-da-mata"],
    'Apuleia leiocarpa': ["Garapa", "Grapiá", "Amarelinho", "Garapeira"],
    'Araucaria angustifolia': ["Pinheiro", "Pinheiro-do-paraná", "Araucária", "Pinheiro-brasileiro", "Pinho"],
    'Aspidosperma macrocarpon': ["Peroba", "Balsinha", "Guatambu"],
    'Aspidosperma polyneuron': ["Peroba rosa", "Amargoso", "Guatambu-amarelo", "Peroba"],
    'Aspidosperma sp': ["Peroba", "Guatambu"],
    'Astronium lecointei': ["Muiracatiara-rajada", "Maracatiara", "Muiracatiara", "Aderno-preto", "Aroeira", "Baracatiara", "Gibatão-rajado", "Pau-gonçalo", "Sanguessugueira", "Gonçalo-alves"],
    'Bagassa guianensis': ["Tatajuba", "Amaparana", "Amarelão", "Bagaceira", "Bagaceiro", "Pente-de-macaco"],
    'Balfourodendron riedelianum': ["Pau-marfim", "Guatambu", "Farinha-seca", "Pau-liso", "Marfim"],
    'Bertolethia excelsa': ["Castanheira", "Castanha-do-pará", "Anhauba", "Castanha-do-brasil"],
    'Bowdichia sp': ["Sucupira", "Cutiúba", "Macanaíba", "Sucupira-preta", "Sucupira-açu", "Sapupira"],
    'Brosimum paraensis': ["Muirapiranga", "Conduru", "Pau-rainha", "Falso-pau-brasil", "Pau-vermelho", "Conduru-de-sangue"],
    'Buchenavia huberi': ["Tanibuca", "Cuiarana", "Mirindiba", "Timboritá"],
    'Calophyllum brasiliense': ["Jacareúba", "Guanandi", "Acá", "Bálsamo-jacereúba", "Cedro-do-pântano", "Oanandi"],
    'Caraipa densifolia': ["Camaçari", "Alfinim", "Bacupari", "Caraipa", "Gororoba", "Macucu", "Tamacoaré"],
    'Carapa guianensis': ["Andiroba", "Nandiroba", "Carapá"],
    'Cariniana estrellensis': ["Jequitibá-branco", "Estopeira", "Cachimbo-de-macaco", "Jequitibá"],
    'Cedrela fissilis': ["Cedro-rosa", "Cedro-branco", "Cedro"],
    'Cedrela odorata': ["Cedro", "Cedro-cheiroso", "Cedro-mogno", "Acaju", "Cedrilho", "Cedro-rosa"],
    'Cedrela sp': ["Cedro"],
    'Cedrelinga cateniformis': ["Cedrorana", "Cedro-amazonense", "Bandarra", "Cedrilho", "Mara", "Cedro-branco"],
    'Clarisia racemosa': ["Guariúba", "Oiticica-amarela", "Catruz"],
    'Copaifera sp': ["Copaíba", "Pau-de-óleo", "Copaibarana"],
    'Cordia goeldiana': ["Freijó", "Frei-jorge", "Louro-freijó"],
    'Cordia sp': ["Freijó", "Frei-jorge", "Amescla"],
    'Couratari sp': ["Tauari", "Estopeiro", "Imbirema"],
    'Dialium guianense': ["Jataibepa", "Azedinha", "Cururu", "Durinho", "Ébano", "Garapa", "Guamirim-preto", "Iataíbaba", "Ipu", "Itu", "Jataí", "Parajuba", "Pau-ferro", "Tamarindo"],
    'Dipteryx micrantha': ["Cumaru"],
    'Dipteryx sp': ["Cumaru"],
    'Enterolobium schomburgkii': ["Fava-de-rosca", "Angelim-rosca", "Fava-orelha-de-macaco", "Faveira-grande", "Orelha-de-gato", "Orelha-de-macaco", "Paricana", "Sucupira-amarela", "Tamboril"],
    'Erisma uncinatum': ["Cedrinho", "Jaboti", "Quaruba-vermelha", "Quarubarana", "Verga-de-jabuti"],
    'Eucalyptus sp': ["Eucalipto"],
    'Euxylophora paraensis': ["Pau-amarelo", "Pequiá-cetim", "Amarelão", "Amarelinho", "Cetim", "Muiratanã"],
    'Goupia glabra': ["Cupiúba", "Peroba-do-norte", "Peroba-fedida", "Vinagreiro", "Peniqueiro"],
    'Grevilea robusta': ["Grevílea"],
    'Guarea guidonia': ["Marinheiro", "Carrapeta", "Gitó"],
    'Handroanthus sp': ["Ipê"],
    'Hura crepitans': ["Açacu", "Árvore-do-diabo", "Açacu-branco", "Assacu", "Catauá", "Pinho-do-norte", "Uçacu"],
    'Hymenaea courbaril': ["Jatobá", "Jatobazeiro", "Jataí"],
    'Hymenaea sp': ["Jatobá"],
    'Hymenolobium petraeum': ["Angelim-pedra", "Angelim", "Angelim-amarelo", "Angelim-da-mata", "Mirarema", "Sucupira-amarela"],
    'Hymenolobium sp': ["Angelim", "Angelim-amarelo", "Angelim-amargoso", "Angelim-comum", "Angelim-do-pará", "Angelim-doce", "Angelim-fava", "Angelim-pedra", "Angelim-rosa", "Mirarema"],
    'Laurus nobilis': ["Louro", "Louro-de-tempero"],
    'Machaerium sp': ["Jacarandá", "Bico-de-pato", "Barreiro"],
    'Manilkara huberi': ["Maçaranduba", "Paraju", "Aparaiú", "Balata", "Chauá", "Gararoba", "Maçaranduba-amarela", "Maçaranduba-branca", "Maçaranduba-preta", "Maçaranduba-verdadeira", "Maçaranduba-vermelha", "Maparajuba", "Parajuba", "Ucuúba"],
    'Marmaroxylon Racemosum': ["Angelim-rajado", "Ingá", "Sucupira", "Angelim", "Angelim-pintado", "Angico-rajado", "Uruburuzeiro", "Ipê-tigre"],
    'Melia azedarach': ["Cinamomo"],
    'Mezilaurus itauba': ["Itaúba", "Itaúba-amarela", "Itaúba-abacate", "Itaúba-grande", "Itaúba-preta", "Itaúba-verdadeira", "Itaúba-vermelha", "Louro-itaúba", "Cedro-pardo,"],
    'Micropholis venulosa': ["Rosadinho", "Abiurana-mangabinha", "Curupixá", "Gogó-de-guariba", "Guajará"],
    'Mimosa scabrella': ["Bracatinga", "Anizeiro", "Maracatinga"],
    'Myroxylon balsamum': ["Bálsamo", "Cabreúva", "Pau-de-bálsamo"],
    'Nectandra dioica': ["Canela"],
    'Ocotea porosa': ["Imbuia", "Canela-imbuia"],
    'Parahancornia fasciculata': ["Amapá-amargoso", "Amapá", "Amapá-doce", "Curupixá", "Mogno-dourado"],
    'Peltogyne sp': ["Roxinho", "Pau-roxo", "Amarante", "Coataquiçaua", "Violeta"],
    'Pinus sp': ["Pinus", "Pinho"],
    'Piptadenia sp': ["Angico", "Pau-jacaré"],
    'Podocarpus lambertii': ["Pinheiro-bravo"],
    'Pouteria pachycarpa': ["Goiabão", "Abiu-casca-grossa", "Abiurana", "Abiurana-amarela", "Abiurana-goiaba", "Perotinga"],
    'Qualea albiflora': ["Mandioqueira", "Caixeta", "Canela-mandioca", "Mandioca", "Morototó", "Pau-terra", "Quaruba-lisa", "Tamanqueira"],
    'Qualea brevipedicellata': ["Mandioqueira", "Mandioqueira-áspera", "Quarubatinga"],
    'Roupala brasiliensis': ["Carvalho-brasileiro", "Carvalho"],
    'Sextonia rubra': ["Louro-vermelho", "Cambará-rosa", "Canela-vermelha", "Gamela", "Itaubão", "Louro", "Louro-canela", "Mogno-tabasco-falso"],
    'Simarouba amara': ["Marupá", "Caixeta", "Cabatã-de-leite", "Cajurana", "Calunga", "Caraíba", "Caroba", "Carrapatinho", "Malacacheta", "Maraupaúba", "Marubá", "Marupá", "Mata-barata", "Paparaúba", "Paraíba"],
    'Swietenia macrophylla': ["Mogno", "Mogno-brasileiro"],
    'Trattinnickia burserifolia': ["Amescla", "Almesclão", "Breu", "Breu-preto", "Breu-sucuruba", "Mangue", "Morcegueira", "Sucuruba"],
    'Vatairea guianensis': ["Faveira-amargosa", "Angelim-amargoso", "Fava", "Fava-amarela", "Fava-grande", "Fava-amargosa", "Lombrigueira", "Sucupira", "Sucupira-amarela"],
    'Virola surinamensis': ["Ucuúba", "Ucuúba-da-mata", "Envirola"],
    'Vochysia maxima': ["Quaruba", "Cedrorana", "Guaruba", "Quaruba-cedro", "Quaruba-verdadeira"],
    'Vochysia sp': ["Quaruba", "Guaruba"],
    'Vochysiaceae sp': ["Quaruba", "Guaruba"]
}

async def seed_species():
  
  async for session in get_async_session():
    created = 0

    for class_id, scientific_name in ID2LABEL.items():
      result = await session.execute(
        select(Species).where(Species.model_class_id == class_id)
      )
      exists = result.scalars().first()
      if exists:
        continue

      # Criação da instância principal da espécie
      species = Species(
        scientific_name=scientific_name,
        model_class_id=class_id,
        description=None
      )

      # Busca os nomes populares no mapeamento
      names_list = POPULAR_NAMES_MAP.get(scientific_name,)
      
      # Cria objetos SpeciesPopularName e associa à espécie
      for name in names_list:
        popular_name_obj = SpeciesPopularName(name=name)
        species.popular_names.append(popular_name_obj)

      base_dir = Path(__file__).resolve().parent.parent.parent.parent
      img_path = base_dir / "static" / "species" / f"{scientific_name}.jpg"

      if not img_path.exists():
        print(f"⚠️ Imagem não encontrada: {img_path}")
        continue

      safe_name = slugify(scientific_name)
      image_url = await upload_local_file_to_s3(img_path, f"catalog/{safe_name}")

      species_image = SpeciesImage(
        image_url=image_url,
        is_primary=True
      )

      species.species_images.append(species_image)

      session.add(species)
      created += 1

    await session.commit()
  print(f"🌱 Seed concluído: {created} espécies processadas")

if __name__ == "__main__":
  asyncio.run(seed_species())