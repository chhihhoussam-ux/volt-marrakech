import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight, MapPin, Clock, Zap, Leaf, Shield, Smile, Navigation,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Guide de Marrakech | Explorer la ville en scooter électrique',
  description:
    'Découvrez les meilleurs endroits de Marrakech en scooter électrique. Médina, Majorelle, souks, palais — notre guide complet pour explorer la ville rouge.',
  openGraph: {
    title: 'Guide de Marrakech en scooter électrique — Volt',
    description:
      'Les incontournables de Marrakech à explorer en scooter électrique : Jardin Majorelle, médina, souks, Jemaa el-Fna, Palmeraie et bien plus.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Marrakech vue du ciel',
      },
    ],
  },
}

const places = [
  {
    name: 'Jardin Majorelle',
    distance: '3 km du centre',
    duration: '10 min en scooter',
    description:
      'Oasis de verdure au cœur de la ville nouvelle, le Jardin Majorelle est un chef-d\'œuvre botanique créé par Jacques Majorelle et restauré par Yves Saint Laurent. Ses bleus intenses et ses cactus géants en font l\'un des lieux les plus photographiés du Maroc.',
    tip: 'Arrivez tôt le matin (ouverture à 8h) pour éviter la foule. Parking scooter facile devant l\'entrée.',
    emoji: '🌿',
  },
  {
    name: 'Médina et les souks',
    distance: 'Au cœur de la ville',
    duration: 'Sur place',
    description:
      'Classée au patrimoine mondial de l\'UNESCO, la médina de Marrakech est un labyrinthe fascinant de ruelles, de fondouks et de souks thématiques. Épices, cuir, poteries, textiles — chaque quartier a sa spécialité. Le scooter électrique, silencieux et compact, se faufile idéalement dans les artères principales.',
    tip: 'Garez votre scooter aux abords de la médina (parkings gardés à 5 MAD/h) et explorez à pied l\'intérieur.',
    emoji: '🕌',
  },
  {
    name: 'Palais de la Bahia',
    distance: '1,5 km de Jemaa el-Fna',
    duration: '5 min en scooter',
    description:
      'Construit à la fin du XIXe siècle, le palais de la Bahia est un joyau de l\'architecture arabo-andalouse. Ses cours intérieures ornées de zelliges, ses jardins parfumés d\'orangers et ses salles décorées de stucs racontent l\'opulence des vizirs de l\'époque.',
    tip: 'Combinez la visite avec le Mellah (quartier juif historique) à deux pas. Accès en scooter facile par Rue Riad Zitoun el-Jedid.',
    emoji: '🏛️',
  },
  {
    name: 'Place Jemaa el-Fna',
    distance: 'Centre névralgique',
    duration: 'Sur place',
    description:
      'Le cœur battant de Marrakech, inscrite au patrimoine immatériel de l\'UNESCO. Conteurs, musiciens gnaoua, charmeurs de serpents le jour, odeurs de tagines et lumières des étalages la nuit — la place se transforme au fil des heures. Un spectacle vivant et permanent.',
    tip: 'Montez dans l\'un des cafés de la place pour observer la scène depuis les terrasses. Venez de nuit pour l\'ambiance au maximum.',
    emoji: '✨',
  },
  {
    name: 'Palmeraie de Marrakech',
    distance: '12 km du centre',
    duration: '20 min en scooter',
    description:
      'Avec plus de 100 000 palmiers dattiers, la Palmeraie est le poumon vert de Marrakech. Route des dunes, balades à dromadaire, villas luxueuses et hammams traditionnels se côtoient dans un décor d\'Afrique du Nord authentique. La grande autonomie de nos scooters rend cette excursion parfaitement accessible.',
    tip: 'Idéal au coucher du soleil. Prenez la route de Fès puis bifurquez vers Circuit de la Palmeraie. Prévoir 2-3h minimum.',
    emoji: '🌴',
  },
  {
    name: 'Musée Yves Saint Laurent',
    distance: '3 km du centre',
    duration: '10 min en scooter',
    description:
      'Inauguré en 2017, le musée YSL Marrakech retrace l\'histoire de la maison de couture et sa relation profonde avec la ville ocre. L\'architecture du bâtiment, inspirée des caillouté brodés des vêtements berbères, est elle-même une œuvre d\'art. Les expositions temporaires accueillent des artistes internationaux.',
    tip: 'Situé juste à côté du Jardin Majorelle — combinez les deux visites en une demi-journée.',
    emoji: '🎨',
  },
]

const whyScooter = [
  {
    icon: <Navigation size={20} strokeWidth={1.5} />,
    title: 'Liberté totale',
    desc: 'Pas d\'itinéraire fixe, pas d\'horaires. Explorez à votre rythme, faites demi-tour quand vous voulez, garez-vous partout.',
  },
  {
    icon: <Leaf size={20} strokeWidth={1.5} />,
    title: 'Zéro émission',
    desc: 'Aucun rejet de CO₂, aucun bruit. Respectueux de la médina, des résidents et de l\'environnement.',
  },
  {
    icon: <Clock size={20} strokeWidth={1.5} />,
    title: 'Gain de temps',
    desc: 'Évitez les embouteillages et les longues marches sous le soleil. Entre deux sites, quelques minutes suffisent.',
  },
  {
    icon: <Smile size={20} strokeWidth={1.5} />,
    title: 'Expérience unique',
    desc: 'Rouler dans les rues de Marrakech en scooter électrique, c\'est vivre la ville comme les locaux, avec une touche de modernité.',
  },
]

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Guide de Marrakech en scooter électrique',
  description:
    'Découvrez les incontournables de Marrakech à explorer en scooter électrique : Jardin Majorelle, médina, Jemaa el-Fna, Palmeraie et bien plus.',
  image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?w=1200&q=80',
  author: {
    '@type': 'Organization',
    name: 'Volt Marrakech',
    url: 'https://volt-marrakech.ma',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Volt Marrakech',
    logo: {
      '@type': 'ImageObject',
      url: 'https://volt-marrakech.ma/logo.svg',
    },
  },
  datePublished: '2024-01-01',
  dateModified: '2024-12-01',
  mainEntityOfPage: 'https://volt-marrakech.ma/guide',
}

const touristDestinationSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  name: 'Marrakech',
  description:
    'La ville rouge du Maroc, célèbre pour sa médina historique, ses souks animés, le Jardin Majorelle et la place Jemaa el-Fna.',
  url: 'https://volt-marrakech.ma/guide',
  touristType: ['CulturalTourist', 'AdventureTourist'],
  includedInDataCatalog: {
    '@type': 'DataCatalog',
    name: 'Volt Marrakech Guide',
  },
}

export default function GuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristDestinationSchema) }}
      />

      <Navbar />
      <main style={{ paddingTop: 56 }}>

        {/* ─── HERO ─── */}
        <section style={{
          position: 'relative',
          padding: '100px 24px 80px',
          background: '#0a0a0a',
          overflow: 'hidden',
        }}>
          {/* Decorative background text */}
          <div style={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 'clamp(100px, 15vw, 200px)',
            fontWeight: 500,
            letterSpacing: '-0.06em',
            color: 'rgba(255,255,255,0.03)',
            lineHeight: 1,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}>
            MARRAKECH
          </div>

          <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 20,
              background: 'rgba(200,255,0,0.12)', border: '0.5px solid rgba(200,255,0,0.3)',
              marginBottom: 24,
            }}>
              <MapPin size={12} strokeWidth={2} color="#C8FF00" />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#C8FF00' }}>Guide de voyage</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 60px)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              marginBottom: 24,
              lineHeight: 1.05,
              maxWidth: 700,
            }}>
              Explorez Marrakech en scooter électrique
            </h1>

            <div style={{ maxWidth: 680 }}>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: 16 }}>
                Marrakech est une ville qui se vit à hauteur d'homme, dans ses ruelles sinueuses, ses places animées, ses jardins secrets. La ville rouge — ainsi surnommée pour ses remparts en pisé ocre — concentre en quelques kilomètres carrés une densité de culture, d'histoire et de sensations rares.
              </p>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: 16 }}>
                Si les calèches et taxis ont longtemps dominé les rues, une nouvelle manière de découvrir Marrakech s'impose doucement : le scooter électrique. Silencieux, léger, zéro émission — il s'intègre parfaitement dans le tissu urbain dense de la médina et permet de passer en quelques minutes de la place Jemaa el-Fna au Jardin Majorelle, de la Bahia à la Palmeraie.
              </p>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: 16 }}>
                Chez Volt Marrakech, nous avons compilé les incontournables de la ville rouge pour vous aider à organiser votre itinéraire. Chaque lieu est décrit avec sa distance depuis le centre, le temps de trajet en scooter, et nos conseils pratiques pour en profiter pleinement.
              </p>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
                Que vous ayez une journée, un week-end ou une semaine, Marrakech se laisse découvrir sans se livrer tout de suite. Chaque visite révèle une nouvelle couche : les souks changent de couleur selon l'heure, la médina se transforme de jour en nuit, les jardins offrent un calme inattendu en plein cœur du bruit. C'est cette magie que le scooter électrique vous permet de saisir — en liberté, à votre rythme, sans contrainte.
              </p>
            </div>
          </div>
        </section>

        {/* ─── LES INCONTOURNABLES ─── */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Nos sélections
              </p>
              <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em' }}>
                Les incontournables
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {places.map((place, i) => (
                <div key={i} style={{
                  borderRadius: 12,
                  border: '0.5px solid rgba(0,0,0,0.08)',
                  background: '#ffffff',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: '#F5F5F5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, flexShrink: 0,
                    }}>
                      {place.emoji}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 500, color: '#0a0a0a', marginBottom: 4 }}>
                        {place.name}
                      </h3>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#757575' }}>
                          <MapPin size={11} strokeWidth={1.5} />
                          {place.distance}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#757575' }}>
                          <Clock size={11} strokeWidth={1.5} />
                          {place.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 14, color: '#757575', lineHeight: 1.7 }}>
                    {place.description}
                  </p>

                  {/* Tip */}
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'rgba(200,255,0,0.06)',
                    border: '0.5px solid rgba(200,255,0,0.2)',
                    display: 'flex',
                    gap: 8,
                  }}>
                    <Zap size={14} strokeWidth={1.5} color="#5a9000" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 12, color: '#3a5a00', lineHeight: 1.6 }}>
                      <strong>Conseil Volt :</strong> {place.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── POURQUOI LE SCOOTER ÉLECTRIQUE ─── */}
        <section style={{ padding: '80px 24px', background: '#F5F5F5' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#757575', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Nos convictions
              </p>
              <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em' }}>
                Pourquoi le scooter électrique ?
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {whyScooter.map((item, i) => (
                <div key={i} style={{
                  padding: '28px',
                  borderRadius: 12,
                  border: '0.5px solid rgba(0,0,0,0.08)',
                  background: '#ffffff',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, background: '#0a0a0a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#C8FF00', marginBottom: 20,
                  }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#757575', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, background: '#C8FF00', borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <Zap size={24} strokeWidth={1.5} color="#0a0a0a" />
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Prêt à explorer Marrakech ?
            </h2>
            <p style={{ fontSize: 16, color: '#757575', lineHeight: 1.7, marginBottom: 32 }}>
              Choisissez votre scooter, sélectionnez vos dates et partez à l'aventure. Notre équipe se charge de tout le reste.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/reserver" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', background: '#C8FF00', border: 'none',
                  borderRadius: 10, fontSize: 15, fontWeight: 500, color: '#0a0a0a', cursor: 'pointer',
                }}>
                  Réserver votre scooter <ArrowRight size={16} strokeWidth={1.5} />
                </button>
              </Link>
              <Link href="/scooters" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', background: 'transparent',
                  border: '0.5px solid rgba(0,0,0,0.12)',
                  borderRadius: 10, fontSize: 15, color: '#0a0a0a', cursor: 'pointer',
                }}>
                  Voir la flotte
                </button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
