import { Radio } from 'lucide-react'
import Search from './components/Search'
import styles from './Header.module.scss'
import TopicForm from './components/TopicForm'

const Header = () => {
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
      <Search />
    </div>
  )
}

export default Header
