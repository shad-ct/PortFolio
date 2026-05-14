import { useEffect, useState } from "react";

const list = [
    "T-27:30:00 Install and connect LV flight batteries.",
    "T-22:30:00 Topoff of LM super critical helium.",
    "T-19:00:00 CSM crew storage. (to T-12:30:00)",
];

const terminals: Record<string, boolean> = {};
const startwords: string[] = [];
const wordstats: Record<string, string[]> = {};

list.forEach(item => {
    const words = item.split(' ');
    terminals[words[words.length - 1]] = true;
    startwords.push(words[0]);
    for (let j = 0; j < words.length - 1; j++) {
        if (wordstats.hasOwnProperty(words[j])) {
            wordstats[words[j]].push(words[j + 1]);
        } else {
            wordstats[words[j]] = [words[j + 1]];
        }
    }
});

const choice = (a: string[]) => a[Math.floor(a.length * Math.random())];

const writeLine = (min_length: number, retries = 0): string => {
    if (retries > 10) return "T-19:00:00 Initializing primary sequence...";
    let word = choice(startwords);
    if (!word) return "Connecting...";

    const line = [word];
    let maxIter = 50;
    while (wordstats.hasOwnProperty(word) && wordstats[word] && maxIter > 0) {
        maxIter--;
        const next_words = wordstats[word];
        word = choice(next_words);
        line.push(word);
        if (line.length > min_length && terminals.hasOwnProperty(word)) break;
    }
    if (line.length < min_length) return writeLine(min_length, retries + 1);
    return line.join(' ');
};

export default function LoadingSequence() {
    const [progress, setProgress] = useState(0);
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        let isMounted = true;
        const totalSteps = 50;

        for (let i = 0; i <= totalSteps; i++) {
            setTimeout(() => {
                if (!isMounted) return;
                setProgress(i * 2);

                if (i === totalSteps) {
                    for (let j = 0; j < 15; j++) {
                        setTimeout(() => {
                            if (!isMounted) return;
                            const newLine = writeLine(3 + Math.floor(4 * Math.random()));
                            setLines(prev => [...prev, newLine]);
                        }, j * 50);
                    }
                }
            }, i * 15);
        }

        return () => { isMounted = false; };
    }, []);

    const hashes = "#".repeat(Math.floor(progress / 2));
    const emptySpaces = ".".repeat(50 - Math.floor(progress / 2));

    // For smaller screens (20 characters max)
    const smallHashes = "#".repeat(Math.floor(progress / 5));
    const smallEmptySpaces = ".".repeat(20 - Math.floor(progress / 5));

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f4efe7] text-[#111111] font-mono">
            <div className="w-full max-w-2xl text-left">
                <div className="mb-4">
                    <span className="font-bold">LOADING MISSION SEQUENCE</span>
                    <br />
                    <span className="hidden sm:inline">[{hashes}{emptySpaces}] {progress}%</span>
                    <span className="sm:hidden">[{smallHashes}{smallEmptySpaces}] {progress}%</span>
                </div>

                <div className="h-64 overflow-hidden text-sm sm:text-base opacity-80">
                    {lines.map((line, idx) => (
                        <div key={idx}>{line}</div>
                    ))}
                    <div className="animate-pulse font-bold">_</div>
                </div>
            </div>
        </div>
    );
}
