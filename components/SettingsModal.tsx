"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

interface SettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
    const router = useRouter();
    const me = useQuery(api.users.me);
    const updateProfile = useMutation(api.users.update);

    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const nameId = useId();

    useEffect(() => {
        if (me?.name) {
            setName(me.name);
        }
    }, [me]);

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setMessage(null);
            if (me?.name) setName(me.name);
        }
    }, [open, me]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);

        try {
            await updateProfile({
                name: name.trim() || undefined,
            });

            setMessage({ type: "success", text: "Profile updated successfully!" });

            // Clear success message after 3 seconds
            setTimeout(() => {
                if (open) setMessage(null);
            }, 3000);

        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: "error", text: "Failed to update profile" });
        } finally {
            setIsSaving(false);
        }
    };



    if (!me) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Manage your account settings
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor={nameId}>Name</Label>
                            <Input
                                id={nameId}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                            />
                        </div>
                        <p className="text-[0.8rem] text-muted-foreground">
                            This is how you will appear in groups and expenses.
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving || name === me.name}
                            size="sm"
                        >
                            {isSaving ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {message && (
                    <Alert
                        className={
                            message.type === "success"
                                ? "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900"
                                : "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900"
                        }
                    >
                        <AlertDescription
                            className={
                                message.type === "success"
                                    ? "text-green-800 dark:text-green-300"
                                    : "text-red-800 dark:text-red-300"
                            }
                        >
                            {message.text}
                        </AlertDescription>
                    </Alert>
                )}

            </DialogContent>
        </Dialog >
    );
}
