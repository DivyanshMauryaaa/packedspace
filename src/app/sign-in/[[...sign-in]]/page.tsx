import { SignIn } from "@clerk/nextjs";

const page = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-1/2 h-full bg-gray-900 text-white text-start flex flex-col justify-end p-4">
                <p className="text-5xl">Welcome back user! Nice to see you here...</p>
            </div>
            <div className="w-1/2 h-full p-5">
                <div className="m-auto">
                    <SignIn />
                </div>
            </div>
        </div>
    )
}

export default page;