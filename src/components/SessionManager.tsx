import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SessionManager = () => {
    return (
        <Card className="bg-gray-950/30 border-purple-500/20">
            <CardHeader>
                <CardTitle className="text-2xl text-blue-400">Session Manager</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Session manager content goes here.</p>
            </CardContent>
        </Card>
    );
};