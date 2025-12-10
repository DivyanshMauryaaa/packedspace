"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Using React.ComponentProps to infer types is safer and easier
export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
