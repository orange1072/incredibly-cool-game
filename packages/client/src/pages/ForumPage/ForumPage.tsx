import { Helmet } from 'react-helmet';
import styles from './ForumPage.module.scss';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Header } from './components/Header';
import { TopicsList } from './components/TopicsList';
import { useEffect, useMemo, useState } from 'react';
import { TopicResponse, useGetTopicsQuery } from '@/api/topicApi';

const filterTopics = (topics: TopicResponse[], searchQuery: string) => {
  const query = searchQuery.toLowerCase();
  return topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(query) ||
      (Array.isArray(topic.tags)
        ? topic.tags.some((tag) => tag.toLowerCase().includes(query))
        : false)
  );
};

export const ForumPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: topicsData, error } = useGetTopicsQuery();

  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const filteredTopics: TopicResponse[] = useMemo(() => {
    if (topicsData) {
      return filterTopics(topicsData, searchQuery);
    }
    return [];
  }, [searchQuery, topicsData]);

  useEffect(() => {
    if (error) {
      console.error(`Cant get topics: ${JSON.stringify(error)}`);
    }
  }, [error]);

  return (
    <>
      <Helmet>
        <title>Forum</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Zone Community Network to ask questions about surviving in the Z.O.N.E."
        />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.fogOverlay} />
        <ParticleBackground />
        <main className={styles.content}>
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <TopicsList
            filteredTopics={filteredTopics}
            setSelectedTopic={setSelectedTopic}
            selectedTopic={selectedTopic}
          />
        </main>
      </div>
    </>
  );
};
