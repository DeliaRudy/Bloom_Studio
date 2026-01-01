
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export const useTheme = () => {
    const { theme, setTheme, resolvedTheme, ...rest } = useNextTheme();

    const customSetTheme = (newTheme: string) => {
        document.documentElement.className = `theme-${newTheme}`;
        setTheme(newTheme);
    }
    
    React.useEffect(() => {
        const currentTheme = localStorage.getItem('theme');
        if(currentTheme) {
             document.documentElement.className = `theme-${currentTheme}`;
        } else {
             document.documentElement.className = 'theme-rose-gold';
        }
    }, []);


    return { ...rest, theme: resolvedTheme || 'rose-gold', setTheme: customSetTheme };
}
