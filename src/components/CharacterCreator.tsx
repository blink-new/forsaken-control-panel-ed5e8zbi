import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Bot } from "lucide-react";
import { Character, Role } from "@/lib/types";
import React from "react";

interface CharacterCreatorProps {
    character?: Character | null;
    onSave: (character: Character) => void;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ character, onSave }) => {
    const [name, setName] = React.useState(character?.name || '');
    const [role, setRole] = React.useState<Role>(character?.role || 'Survivor');

    const handleSave = () => {
        // Basic validation
        if (!name) return;

        const newCharacter: Character = {
            id: character?.id || `char_${Date.now()}`,
            name,
            role,
            description: '',
            subDescription: '',
            visualIdUrl: '',
            stats: { health: 100, stamina: 100, sanity: 100, energy: 100, movementSpeed: 100 },
            abilities: [],
            team: 'Survivor',
            form: 'Reformed',
            state: 'Active',
            tags: [],
        };
        onSave(newCharacter);
    };

    return (
        <Card className="bg-gray-950/30 border-purple-500/20">
            <CardHeader>
                <CardTitle className="text-2xl text-purple-300">Character Creator</CardTitle>
                <CardDescription>Design a new entity or edit an existing one.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="e.g., The Glitch, Subject-13" value={name} onChange={e => setName(e.target.value)} className="font-mono" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={role} onValueChange={(value: Role) => setRole(value)}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Survivor">Survivor</SelectItem>
                                <SelectItem value="Killer">Killer</SelectItem>
                                <SelectItem value="Boss">Boss</SelectItem>
                                <SelectItem value="Glitched Entity">Glitched Entity</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="A brief description of the character..." className="font-mono" />
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-200">
                        <Bot className="h-4 w-4 mr-2" />
                        Generate with AI
                    </Button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-purple-400">Stats</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <Label>Health</Label>
                            <Slider defaultValue={[100]} max={200} step={1} />
                        </div>
                        <div>
                            <Label>Stamina</Label>
                            <Slider defaultValue={[100]} max={200} step={1} />
                        </div>
                        <div>
                            <Label>Sanity</Label>
                            <Slider defaultValue={[100]} max={200} step={1} />
                        </div>
                        <div>
                            <Label>Energy</Label>
                            <Slider defaultValue={[100]} max={200} step={1} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Movement Speed</Label>
                            <Slider defaultValue={[100]} max={200} step={1} />
                        </div>
                    </div>
                </div>

                <Button onClick={handleSave} className="w-full bg-purple-600 hover:bg-purple-700">
                    Save Character
                </Button>
            </CardContent>
        </Card>
    );
};