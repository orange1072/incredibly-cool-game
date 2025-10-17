import { Input } from '@/components/Input'
import styles from './Search.module.scss'
import { Search } from 'lucide-react'

export type SearchProps = {
  searchQuery: string
  setSearchQuery: (value: string) => void
}
const SearchForm = ({ searchQuery, setSearchQuery }: SearchProps) => {
  return (
    /*     <TerminalInput
      placeholder="Search topics and tags..."
      icon={<Search className="w-4 h-4" />}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    /> */
    <Input
      placeholder="Search topics and tags..."
      icon={<Search className="w-4 h-4" />}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  )
}

export default SearchForm
