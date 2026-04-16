import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import type { ApiEmployee } from "@/types/api";

interface ProfessionalCardProps {
  professional: ApiEmployee;
  selected?: boolean;
  onSelect?: (professional: ApiEmployee) => void;
}

const ProfessionalCard = ({
  professional,
  selected,
  onSelect,
}: ProfessionalCardProps) => {
  const fullName = `${professional.nombre} ${professional.apellido}`.trim();

  return (
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
          <AvatarImage src="" alt={fullName} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div>
          <h4 className="font-medium text-foreground">{fullName}</h4>
          {professional.telefono && (
            <p className="text-sm text-muted-foreground">{professional.telefono}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCard;