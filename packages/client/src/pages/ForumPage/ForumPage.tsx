import { Helmet } from 'react-helmet'
import styles from './ForumPage.module.scss'
import { ParticleBackground } from '@/components/ParticleBackground'
import Header from './components/Header'
import TopicsList from './components/TopicsList'
import { useMemo, useState } from 'react'
import { ForumTopic } from './types'
import { topics as mockTopics } from './mockData'

const filterTopics = (topics: ForumTopic[], searchQuery: string) => {
  return topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )
}

export const ForumPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [topics, setTopics] = useState<ForumTopic[]>(mockTopics)

  const filteredTopics: ForumTopic[] = useMemo(
    () => filterTopics(topics, searchQuery),
    [searchQuery, topics]
  )

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
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <TopicsList filteredTopics={filteredTopics} />
        </main>
      </div>
    </>
  )
}
