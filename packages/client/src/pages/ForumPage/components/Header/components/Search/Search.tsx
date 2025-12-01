import { Input } from '@/components/Input';
import { Search } from 'lucide-react';

export type SearchProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};
export const SearchForm = ({ searchQuery, setSearchQuery }: SearchProps) => {
  return (
    <Input
      placeholder="Search topics and tags..."
      icon={<Search className="w-4 h-4" />}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
};
