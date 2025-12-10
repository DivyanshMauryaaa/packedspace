import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserButton } from "@clerk/nextjs";
import { PlusIcon } from "lucide-react";

import { OrganizationList } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <p className="text-3xl font-bold">Packedspace</p>
        <UserButton />
      </div>

      <div className="flex justify-center">
        <OrganizationList
          hidePersonal={true}
          afterSelectOrganizationUrl="/dashboard"
          afterCreateOrganizationUrl="/dashboard"
        />
      </div>
    </div>
  );
}
