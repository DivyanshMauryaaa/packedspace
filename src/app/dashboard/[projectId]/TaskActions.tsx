
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash } from "lucide-react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PLATFORM_ACTIONS, PlatformAction } from "./platform_actions";

interface TaskActionsProps {
    task: any;
    onUpdate: () => void;
}

export default function TaskActions({ task, onUpdate }: TaskActionsProps) {
    // State for the nested "Add Action" flow
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAction, setSelectedAction] = useState<PlatformAction | null>(null);
    const [actionData, setActionData] = useState("");

    // Get unique platforms
    const platforms = ["All", ...Array.from(new Set(PLATFORM_ACTIONS.map(a => a.platform)))];

    // Filter actions
    const filteredActions = PLATFORM_ACTIONS.filter(action => {
        const matchesPlatform = selectedPlatform === "All" || action.platform === selectedPlatform;
        const matchesSearch = action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            action.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPlatform && matchesSearch;
    });

    const handleActionSelect = (action: PlatformAction) => {
        setSelectedAction(action);
        setActionData(action.defaultData);
    };

    const handleSaveAction = async () => {
        if (!selectedAction) return;

        try {
            // Parse data to ensure valid JSON (optional, but good practice)
            let parsedData;
            try {
                parsedData = JSON.parse(actionData);
            } catch (e) {
                toast.error("Invalid JSON data");
                return;
            }

            const newAction = {
                id: crypto.randomUUID(), // Instance ID
                action: selectedAction.id,
                name: selectedAction.name,
                app: selectedAction.platform,
                description: selectedAction.description,
                data: parsedData,
                timestamp: new Date().toISOString()
            };

            const currentActions = task.actions && Array.isArray(task.actions) ? task.actions : [];
            const updatedActions = [...currentActions, newAction];

            const { error } = await supabase
                .from('tasks')
                .update({ actions: updatedActions })
                .eq('id', task.id);

            if (error) throw error;

            toast.success("Action added successfully");
            onUpdate(); // Refresh tasks

            // Reset and close add dialog
            setSelectedAction(null);
            setActionData("");
            setIsAddDialogOpen(false);

        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDeleteAction = async (actionInstanceId: string) => {
        try {
            const currentActions = task.actions && Array.isArray(task.actions) ? task.actions : [];
            const updatedActions = currentActions.filter((a: any) => a.id !== actionInstanceId);

            const { error } = await supabase
                .from('tasks')
                .update({ actions: updatedActions })
                .eq('id', task.id);

            if (error) throw error;

            toast.success("Action removed");
            onUpdate();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={'sm'} variant={'ghost'}>View Actions</Button>
            </DialogTrigger>
            <DialogContent className="w-5xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Actions for: {task.name}</DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant={'outline'}>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Add Action
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto flex flex-col">
                                <DialogHeader>
                                    <DialogTitle>Add New Action</DialogTitle>
                                </DialogHeader>

                                {/* Selection UI */}
                                {!selectedAction ? (
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Platform" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {platforms.map(p => (
                                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                placeholder="Search actions..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="flex-1"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-1">
                                            {filteredActions.map(action => {
                                                const Icon = action.icon;
                                                return (
                                                    <div
                                                        key={action.id}
                                                        onClick={() => handleActionSelect(action)}
                                                        className="p-3 border rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-start gap-3"
                                                    >
                                                        <div className="p-2 bg-primary/10 rounded-md text-primary mt-1">
                                                            <Icon size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-sm">{action.name}</h4>
                                                            <p className="text-xs text-gray-500 line-clamp-2">{action.description}</p>
                                                            <span className="text-[10px] text-gray-400 mt-1 block">{action.platform}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {filteredActions.length === 0 && (
                                                <div className="col-span-2 text-center py-8 text-gray-500">
                                                    No actions found.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => setSelectedAction(null)}>
                                                    ← Back
                                                </Button>
                                                <h3 className="font-semibold">{selectedAction.name}</h3>
                                            </div>
                                            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{selectedAction.platform}</span>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Configuration Data (JSON)</label>
                                            <p className="text-xs text-gray-500 mb-2">Edit the required parameters for this action.</p>
                                            <Textarea
                                                value={actionData}
                                                onChange={(e) => setActionData(e.target.value)}
                                                className="font-mono text-sm h-[300px]"
                                            />
                                        </div>

                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setSelectedAction(null)}>Cancel</Button>
                                            <Button onClick={handleSaveAction}>Add Action</Button>
                                        </DialogFooter>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Existing Actions List */}
                    <div className="space-y-3">
                        {task.actions && Array.isArray(task.actions) && task.actions.length > 0 ? (
                            task.actions.map((action: any, index: number) => {
                                // Find definition to get icon if needed, though we saved it partly
                                const def = PLATFORM_ACTIONS.find(pa => pa.id === action.action);
                                const Icon = def ? def.icon : PlusIcon; // Fallback

                                return (
                                    <div key={action.id || index} className="group flex items-start justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                        <div className="flex gap-3">
                                            <div className="mt-1">
                                                {def && <def.icon className="h-5 w-5 text-gray-500" />}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                                    {action.name}
                                                    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                        {action.app}
                                                    </span>
                                                </h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{action.description}</p>
                                                <div className="mt-2 text-xs font-mono bg-white dark:bg-black border p-2 rounded max-w-[400px] overflow-hidden whitespace-pre-wrap">
                                                    {typeof action.data === 'string' ? action.data : JSON.stringify(action.data, null, 2)}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDeleteAction(action.id)}
                                        >
                                            <Trash size={16} />
                                        </Button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50/50 dark:bg-gray-900/20 border-dashed border-2 rounded-xl">
                                <p>No actions configured for this task.</p>
                                <Button variant="link" onClick={() => setIsAddDialogOpen(true)}>Add your first action</Button>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
