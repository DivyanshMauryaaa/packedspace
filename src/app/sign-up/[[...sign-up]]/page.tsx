import { SignUp } from "@clerk/nextjs";

const page = () => {
    return (
        <div className="flex items-center justify-between h-screen">
            <div className="w-1/2 h-full bg-gray-900 text-white text-start flex flex-col justify-end p-4">
                <p className="text-5xl">Build Quality Software 100 times faster with Packedspace</p>
            </div>
            <div className="w-1/2 h-full p-5">
                <SignUp />
            </div>
        </div>
    )
}

export default page;