import React from 'react'
import { ForumTopic } from '../../types'
import Topic from './components/Topic'

type TopicsListProps = {
  filteredTopics: ForumTopic[]
}

const TopicsList = ({ filteredTopics }: TopicsListProps) => {
  return (
    <div>
      {filteredTopics.map((topic) => (
        <Topic key={topic.id} {...topic} />
      ))}
    </div>
  )
}

export default TopicsList
