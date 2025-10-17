import { Helmet } from 'react-helmet'
import styles from './ForumPage.module.scss'
import { Particle } from '@/components/Particle'
import { ParticleBackground } from '@/components/ParticleBackground'
import ForumHeader from './components/ForumHeader'

export const ForumPage = () => {
  return (
    <>
      <Helmet>
        <title>Forum</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="{{Zone Community Network to ask questions about surviving in the Z.O.N.E.}}"
        />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.fogOverlay} />
        <ParticleBackground />
        <main className={styles.content}>
          <ForumHeader />
        </main>
      </div>
    </>
  )
}
