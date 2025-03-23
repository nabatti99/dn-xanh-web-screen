import { useEffect, useRef } from "react";
import { VoiceMessageProps } from "./type";

export const VoiceMessage = ({ voice, onFinish = () => {}, ...props }: VoiceMessageProps) => {
    const audioSrcRef = useRef<string>();
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioSrcRef.current === voice) return;
        audioSrcRef.current = voice;

        audioRef.current?.play().catch((error) => {
            console.error("Error playing audio:", error);
        });

        audioRef.current?.addEventListener(
            "ended",
            () => {
                onFinish();
            },
            { once: true }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voice]);

    return <audio ref={audioRef} src={voice} />;
};
