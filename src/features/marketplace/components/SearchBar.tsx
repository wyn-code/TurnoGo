import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "Buscar negocios..." }: SearchBarProps) => (
  <div className="relative w-full">
    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="pl-10"
    />
  </div>
);

export default SearchBar;
