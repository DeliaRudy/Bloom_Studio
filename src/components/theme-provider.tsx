
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export const useTheme = () => {
    const context = React.useContext(NextThemesProvider)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }

    const { theme, setTheme, resolvedTheme } = context;

    const customSetTheme = (newTheme: string) => {
        // next-themes uses the 'class' attribute, but we want to apply our themes directly.
        // We'll manually set the class on the html element.
        document.documentElement.className = `theme-${newTheme}`;
        // We still call setTheme to keep next-themes in sync and for localStorage persistence.
        setTheme(newTheme);
    }
    
    // On mount, make sure the correct class is applied based on the stored theme.
    React.useEffect(() => {
        if(theme) {
            document.documentElement.className = `theme-${theme}`;
        }
    }, [theme]);


    return { ...context, theme: resolvedTheme || 'rose-gold', setTheme: customSetTheme };
}
