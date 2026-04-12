import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import type { Professional } from "../../types";

interface ProfessionalCardProps {
  professional: Professional;
  selected?: boolean;
  onSelect?: (professional: Professional) => void;
}

const ProfessionalCard = ({
  professional,
  selected,
  onSelect,
}: ProfessionalCardProps) => (
  <Card
    className={`cursor-pointer transition-all ${
      selected
        ? "border-primary ring-2 ring-primary/20"
        : "border-border hover:border-primary/40"
    }`}
    onClick={() => onSelect?.(professional)}
  >
    <CardContent className="flex items-center gap-4 p-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src="" alt={professional.name} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {professional.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div>
        <h4 className="font-medium text-foreground">{professional.name}</h4>
        {professional.phone && (
          <p className="text-sm text-muted-foreground">{professional.phone}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

export default ProfessionalCard;