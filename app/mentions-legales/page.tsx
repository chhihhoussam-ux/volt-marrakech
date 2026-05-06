import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Mentions l\u00e9gales & CGV',
  description: 'Mentions l\u00e9gales et conditions g\u00e9n\u00e9rales de vente \u2014 Almone Scooter Rental, Marrakech.',
}

const fontFamily = 'var(--font-dm-sans), "DM Sans", -apple-system, sans-serif'

export default function MentionsLegales() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <h1
          style={{
            fontFamily,
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            marginBottom: 8,
          }}
        >
          Mentions l&eacute;gales &amp; CGV
        </h1>
        <p
          style={{
            fontFamily,
            fontSize: 13,
            color: '#757575',
            marginBottom: 56,
          }}
        >
          Derni&egrave;re mise &agrave; jour : Mai 2025
        </p>

        {/* 1. Informations l\u00e9gales */}
        <h2
          style={{
            fontFamily,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: 20,
            paddingTop: 40,
          }}
        >
          Informations l&eacute;gales
        </h2>
        <p style={{ fontFamily, fontSize: 15, color: '#0a0a0a', lineHeight: 1.8 }}>
          Raison sociale : Almone Scooter Rental<br />
          Activit&eacute; : Location de scooters &eacute;lectriques<br />
          Ville : Marrakech, Maroc<br />
          Email : contact@almone-scooter.com<br />
          Site web : www.almone-scooter.com
        </p>

        {/* 2. Conditions g\u00e9n\u00e9rales de location */}
        <h2
          style={{
            fontFamily,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: 20,
            paddingTop: 40,
            borderTop: '0.5px solid rgba(0,0,0,0.08)',
          }}
        >
          Conditions g&eacute;n&eacute;rales de location
        </h2>
        <ul
          style={{
            fontFamily,
            fontSize: 15,
            color: '#0a0a0a',
            lineHeight: 1.8,
            listStyleType: 'disc',
            paddingLeft: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <li>&Acirc;ge minimum : 18 ans, permis de conduire valide requis</li>
          <li>Le client est responsable du v&eacute;hicule pendant toute la dur&eacute;e de location</li>
          <li>Tout dommage constat&eacute; au retour sera factur&eacute; au client</li>
          <li>Le scooter doit &ecirc;tre restitu&eacute; dans l&rsquo;&eacute;tat initial, propre et avec la batterie charg&eacute;e</li>
          <li>En cas de panne due &agrave; une mauvaise utilisation, les frais de d&eacute;pannage sont &agrave; la charge du client</li>
          <li>La vitesse maximale autoris&eacute;e est celle indiqu&eacute;e par le code de la route marocain</li>
          <li>Il est interdit de sous-louer le v&eacute;hicule &agrave; un tiers</li>
          <li>Le casque fourni doit &ecirc;tre port&eacute; obligatoirement</li>
        </ul>

        {/* 3. R\u00e9servation et paiement */}
        <h2
          style={{
            fontFamily,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: 20,
            paddingTop: 40,
            borderTop: '0.5px solid rgba(0,0,0,0.08)',
          }}
        >
          R&eacute;servation et paiement
        </h2>
        <ul
          style={{
            fontFamily,
            fontSize: 15,
            color: '#0a0a0a',
            lineHeight: 1.8,
            listStyleType: 'disc',
            paddingLeft: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <li>La r&eacute;servation est confirm&eacute;e apr&egrave;s validation par notre &eacute;quipe</li>
          <li>Le paiement s&rsquo;effectue &agrave; la remise du v&eacute;hicule ou en ligne selon la formule choisie</li>
          <li>Toute annulation moins de 24h avant la date de location pourra entra&icirc;ner des frais</li>
        </ul>

        {/* 4. Responsabilit\u00e9 */}
        <h2
          style={{
            fontFamily,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: 20,
            paddingTop: 40,
            borderTop: '0.5px solid rgba(0,0,0,0.08)',
          }}
        >
          Responsabilit&eacute;
        </h2>
        <ul
          style={{
            fontFamily,
            fontSize: 15,
            color: '#0a0a0a',
            lineHeight: 1.8,
            listStyleType: 'disc',
            paddingLeft: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <li>Almone Scooter Rental d&eacute;cline toute responsabilit&eacute; en cas d&rsquo;accident r&eacute;sultant d&rsquo;une utilisation non conforme du v&eacute;hicule</li>
          <li>Le client est couvert par son assurance personnelle</li>
        </ul>

        {/* 5. Protection des donn\u00e9es */}
        <h2
          style={{
            fontFamily,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: 20,
            paddingTop: 40,
            borderTop: '0.5px solid rgba(0,0,0,0.08)',
          }}
        >
          Protection des donn&eacute;es
        </h2>
        <ul
          style={{
            fontFamily,
            fontSize: 15,
            color: '#0a0a0a',
            lineHeight: 1.8,
            listStyleType: 'disc',
            paddingLeft: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <li>Les donn&eacute;es collect&eacute;es (nom, email, t&eacute;l&eacute;phone) sont utilis&eacute;es uniquement pour la gestion des r&eacute;servations</li>
          <li>Elles ne sont pas transmises &agrave; des tiers</li>
          <li>Conform&eacute;ment au RGPD, vous pouvez demander la suppression de vos donn&eacute;es en contactant contact@almone-scooter.com</li>
        </ul>

        {/* 6. Cookies */}
        <h2
          style={{
            fontFamily,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: 20,
            paddingTop: 40,
            borderTop: '0.5px solid rgba(0,0,0,0.08)',
          }}
        >
          Cookies
        </h2>
        <p style={{ fontFamily, fontSize: 15, color: '#0a0a0a', lineHeight: 1.8 }}>
          Ce site utilise des cookies techniques n&eacute;cessaires au bon fonctionnement du service de r&eacute;servation.
        </p>
      </main>
      <Footer />
    </>
  )
}
