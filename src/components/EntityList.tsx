import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Character } from "@/lib/types";

interface EntityListProps {
    characters: Character[];
    onSelectCharacter: (character: Character) => void;
}

export const EntityList: React.FC<EntityListProps> = ({ characters, onSelectCharacter }) => {
    return (
        <Card className="bg-gray-950/30 border-purple-500/20">
            <CardHeader>
                <CardTitle className="text-xl text-purple-300">Entity List</CardTitle>
                <CardDescription>All active entities in the session.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {characters.map(char => (
                        <li key={char.id} onClick={() => onSelectCharacter(char)} className="p-2 rounded-md hover:bg-purple-500/10 cursor-pointer border-b border-purple-500/10">
                            <p className="font-bold text-purple-400">{char.name}</p>
                            <p className="text-sm text-gray-400">{char.role}</p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};