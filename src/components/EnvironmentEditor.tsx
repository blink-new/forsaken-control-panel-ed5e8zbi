import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EnvironmentEditor = () => {
    return (
        <Card className="bg-gray-950/30 border-purple-500/20">
            <CardHeader>
                <CardTitle className="text-2xl text-green-400">Environment Editor</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Environment editor content goes here.</p>
            </CardContent>
        </Card>
    );
};