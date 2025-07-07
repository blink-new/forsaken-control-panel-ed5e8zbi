import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CombatManager = () => {
    return (
        <Card className="bg-gray-950/30 border-purple-500/20">
            <CardHeader>
                <CardTitle className="text-2xl text-red-400">Combat Manager</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Combat manager content goes here.</p>
            </CardContent>
        </Card>
    );
};