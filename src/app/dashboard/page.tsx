'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/supabase";
import { useOrganization, useUser } from "@clerk/nextjs";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
    const { organization } = useOrganization();
    const { user } = useUser();
    const [name, setName] = useState("");
    const [projects, setProjects] = useState<any>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);

    const createProject = async () => {
        const { error } = await supabase.from('projects')
            .insert({
                name: name,
                organization_id: organization?.id,
            })

        if (error) toast.error(error.message);
        if (!error) toast.success("Project created successfully");
        fetchProjects();
    }

    const fetchProjects = async () => {
        const { data, error } = await supabase.from('projects')
            .select('*')
            .eq('organization_id', organization?.id)

        if (error) toast.error(error.message);
        if (!error) {
            toast.success("Projects fetched successfully");
        }
        setProjects(data);
        setProjectsLoading(false);
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="p-4">

            <p className="text-4xl">{organization?.name}</p>
            <p className="text-2xl text-gray-500">Welcome back {user?.firstName}</p>

            <br />
            <div className="flex gap-3 flex-wrap">

                <Dialog>
                    <DialogTrigger asChild>
                        <div className="w-[300px] h-[300px] border dark:hover:border-white p-6 hover:border-black hover:rounded-3xl cursor-pointer transition-all duration-200 flex flex-col justify-end text-start">
                            <PlusIcon size={64} />
                            <p className="text-2xl">Create Project</p>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Project</DialogTitle>
                        </DialogHeader>
                        <Input placeholder="Project Name eg. 'Web app'" onChange={(e) => setName(e.target.value)} />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button onClick={createProject}>Create</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {projectsLoading && (
                    <div className="h-[40px] w-[40px] border-t border-black border-2 rounded-full animate-spin"></div>
                )}

                {projects.map((project: any) => (
                    <Link key={project.id} href={`/dashboard/${project.id}`}>
                        <div className="w-[300px] h-[300px] border p-6 dark:hover:border-white hover:border-black hover:rounded-3xl cursor-pointer transition-all duration-200 flex flex-col justify-center text-center">
                            <p className="text-4xl font-semibold">{project.name}</p>
                        </div>
                    </Link>
                ))}





            </div>

        </div>
    );
}
