import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AIPromptPanel = () => {
    return (
        <Card className="bg-gray-950/30 border-purple-500/20">
            <CardHeader>
                <CardTitle className="text-2xl text-yellow-400">AI Prompt Panel</CardTitle>
            </CardHeader>
            <CardContent>
                <p>AI prompt panel content goes here.</p>
            </CardContent>
        </Card>
    );
};