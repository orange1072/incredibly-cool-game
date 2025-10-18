import { Radio } from 'lucide-react'
import { SearchForm } from './components/Search'
import styles from './Header.module.scss'
import { TopicForm } from './components/TopicForm'
import { SearchProps } from './components/Search/Search'

export const Header = ({ searchQuery, setSearchQuery }: SearchProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Radio className={styles.icon} />
          <div>
            <h2>COMMUNICATION CHANNEL</h2>
            <p>Zone Community Network</p>
          </div>
        </div>
        <TopicForm />
      </div>
      <SearchForm searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  )
}
