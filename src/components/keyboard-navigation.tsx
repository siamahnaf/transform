"use client"
import { useState, useEffect, useRef } from "react";

interface Option {
    value: string;
    label: string;
}

export const useKeyboardNavigation = (
    list: Option[],
    onSelect: (value: string, label: string) => void,
    isOpen: boolean
) => {
    const [cursor, setCursor] = useState<number>(-1);
    const ref = useRef<HTMLUListElement | null>(null);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (isOpen) {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault(); // Prevent default scrolling behavior
                    setCursor((prev) => (prev < list.length - 1 ? prev + 1 : prev));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setCursor((prev) => (prev > 0 ? prev - 1 : prev));
                    break;
                case "Enter":
                    e.preventDefault(); // Prevent form submission when the dropdown is open
                    if (cursor >= 0 && cursor < list.length) {
                        onSelect(list[cursor].value, list[cursor].label);
                    }
                    break;
                default:
                    break;
            }
        }
    };

    useEffect(() => {
        if (ref.current && cursor >= 0) {
            const optionElement = ref.current.children[cursor] as HTMLElement;
            optionElement?.scrollIntoView({ block: "nearest" });
        }
    }, [cursor]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [cursor, list, isOpen]);

    return { cursor, setCursor, ref };
};
