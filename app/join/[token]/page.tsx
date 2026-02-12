"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { PageLoading } from "@/components/ui/page-loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function JoinGroupPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;
    const [error, setError] = useState<string | null>(null);

    const joinGroup = useMutation(api.tokens.joinGroupWithToken);
    const tokenInfo = useQuery(api.tokens.getByToken, { token, type: "invite" });

    useEffect(() => {
        const join = async () => {
            if (!token) return;
            try {
                const groupId = await joinGroup({ token });
                router.push(`/groups/${groupId}`);
            } catch (err: any) {
                console.error("Error joining group:", err);
                setError(err.message || "Failed to join group");
            }
        };

        if (tokenInfo) {
            if (tokenInfo.disabled) {
                setError("This invite link has already been used or is disabled.");
            } else {
                join();
            }
        } else if (tokenInfo === null) {
            setError("Invalid invite link.");
        }
    }, [token, tokenInfo, joinGroup, router]);

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-md">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="mt-4 flex justify-center">
                    <Link href="/">
                        <Button variant="outline">
                            Go to Dashboard <MoveRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return <PageLoading message="Joining group..." />;
}
