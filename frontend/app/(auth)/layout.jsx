export default function AuthLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            {/* Left side - Branding/Image */}
            <div className="hidden w-1/2 flex-col justify-between bg-zinc-950 p-12 lg:flex relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent"></div>
                <div className="relative z-10 flex items-center gap-2 font-semibold tracking-tight text-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-zinc-950">
                        <span className="text-lg font-bold">X</span>
                    </div>
                    XONET
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">
                        The premium workspace for modern freelancers.
                    </h1>
                    <p className="text-lg text-zinc-400">
                        Connect with top-tier clients, manage your projects efficiently, and deliver exceptional results—all in one place.
                    </p>
                </div>
                <div className="relative z-10 text-sm text-zinc-500">
                    © {new Date().getFullYear()} XONET Inc. All rights reserved.
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex w-full items-center justify-center bg-background px-4 py-12 lg:w-1/2">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
