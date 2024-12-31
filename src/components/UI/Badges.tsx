"use client"
import dynamic from "next/dynamic";
const GitHubCorners = dynamic(() => import("@uiw/react-github-corners"), {
    ssr: false
})

const Badges = () => {
    return (
        <GitHubCorners
            position="right"
            href="https://github.com/siamahnaf/transform"
        />
    );
};

export default Badges;