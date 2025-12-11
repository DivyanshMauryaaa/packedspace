'use client'

import { useState, useEffect } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import supabase from "@/lib/supabase";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import TaskActions from "./TaskActions";

const projectPage = () => {
    const { organization } = useOrganization();
    const { projectId } = useParams();

    const [project, setProject] = useState<any>(null);
    const [projectLoading, setProjectLoading] = useState(true);

    const [tasks, setTasks] = useState<any>([]);
    const [tasksLoading, setTasksLoading] = useState(true);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("not-started");

    const { user } = useUser();

    useEffect(() => {
        fetchProject();
        fetchTasks();
    }, []);

    const fetchProject = async () => {
        const { data, error } = await supabase.from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (error) toast.error(error.message);
        if (!error) {
            toast.success("Project fetched successfully");
        }
        setProject(data);
        setProjectLoading(false);
    }

    const createTask = async () => {
        const { error } = await supabase.from('tasks')
            .insert({
                name: name,
                project_id: projectId,
                description: description,
                status: status,
            })

        if (error) toast.error(error.message);
        if (!error) toast.success("Task created successfully");
        fetchTasks();
    }

    const fetchTasks = async () => {
        const { data, error } = await supabase.from('tasks')
            .select('*')
            .eq('project_id', projectId)

        if (error) toast.error(error.message);
        if (!error) {
            toast.success("Tasks fetched successfully");
        }
        setTasks(data);
        setTasksLoading(false);
    }

    if (!projectLoading && organization?.id != project?.organization_id) {
        toast.error("We could not find the project");
        return (
            <div className="p-4">
                <p className="text-2xl">We could not find the project</p>
            </div>
        )
    }

    if (projectLoading) {
        return (
            <div className="p-4 text-center justify-center flex flex-col h-screen">
                <p className="h-[50px] w-[50px] border-t border-black border-2 rounded-full animate-spin"></p>
            </div>
        )
    }



    return (
        <div className="p-4">
            <p className="text-4xl">{organization?.name}</p>
            <p className="text-2xl text-gray-500">{project?.name}</p>

            <br />
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={'link'}>
                        <PlusIcon size={20} />
                        Create Task
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                    </DialogHeader>
                    <Input placeholder="Task Name" onChange={(e) => setName(e.target.value)} />
                    <Textarea placeholder="Add Description of the task here...." onChange={(e) => setDescription(e.target.value)} className="h-[100px] resize-none" about="Add Description of the task here...." />
                    <Select onValueChange={setStatus} value={status}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Task Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="not-started">Not Started</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button onClick={createTask}>Add Task</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <Input placeholder="Search Tasks..." className="mt-3" />
            <br />
            <div className="w-full m-auto">

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Check</TableHead>
                            <TableHead className="w-[400px]">Task Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[900px]">Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasksLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">Loading tasks...</TableCell>
                            </TableRow>
                        ) : tasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">No tasks found for this project.</TableCell>
                            </TableRow>
                        ) : (
                            tasks.map((task: any) => (
                                <TableRow key={task.id} className="hover:bg-transparent">
                                    <TableCell><Checkbox onClick={async () => {
                                        const newStatus = task.status === 'done' ? 'not-started' : 'done';
                                        const { error } = await supabase.from('tasks')
                                            .update({
                                                status: newStatus,
                                            })
                                            .eq('id', task.id)

                                        if (error) toast.error(error.message);
                                        if (!error) toast.success(`Task marked as ${newStatus}`);
                                        fetchTasks();
                                    }} checked={task.status === 'done'} /></TableCell>
                                    <TableCell className="font-medium">{task.name}</TableCell>
                                    <TableCell>{task.status === 'not-started' && (
                                        <Badge variant={'destructive'} className="w-[100px]">Not Started</Badge>
                                    )}
                                        {task.status === 'in-progress' && (
                                            <Badge variant={'default'} className="w-[100px]">In Progress</Badge>
                                        )}
                                        {task.status === 'done' && (
                                            <Badge variant={'success'} className="w-[100px]">Done</Badge>
                                        )}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>





                                        <TaskActions task={task} onUpdate={fetchTasks} />




                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>


            </div>
        </div>
    )
}

export default projectPage;