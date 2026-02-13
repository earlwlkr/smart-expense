"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function OnboardingModal() {
    const me = useQuery(api.users.me);
    const updateProfile = useMutation(api.users.update);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (me && me.isOnboarded === undefined) {
            setIsOpen(true);
            if (me.name) setName(me.name);
        }
    }, [me]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSaving(true);
        try {
            await updateProfile({
                name: name.trim(),
                isOnboarded: true,
            });
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Welcome to Smart Expense!</DialogTitle>
                    <DialogDescription>
                        Please set your display name to continue. This is how you'll appear to
                        others in your groups.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                placeholder="Your Name"
                                required
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSaving || !name.trim()}>
                            {isSaving ? (
                                <>
                                    <LoadingSpinner className="mr-2 h-4 w-4" />
                                    Saving...
                                </>
                            ) : (
                                "Continue"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
