// import { useEffect, useRef } from "react";
// import { VoiceMessageProps } from "./type";

// export const VoiceMessage = ({ voice, onFinish = () => {}, ...props }: VoiceMessageProps) => {
//     const audioSrcRef = useRef<string>();
//     const audioRef = useRef<HTMLAudioElement>(null);

//     useEffect(() => {
//         // if (audioSrcRef.current === voice) return;
//         // audioSrcRef.current = voice;

//         // if (audioRef.current?.played)

//         audioRef.current?.play().catch((error) => {
//             console.error("Error playing audio:", error);
//         });

//         audioRef.current?.addEventListener(
//             "ended",
//             () => {
//                 onFinish();
//             },
//             { once: true }
//         );

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [voice]);

//     return <audio ref={audioRef} src={voice} />;
// };
import { useEffect, useRef, useState } from "react";
import { VoiceMessageProps } from "./type";

export const VoiceMessage = ({ voice, onFinish = () => {} }: VoiceMessageProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [canPlayAudio, setCanPlayAudio] = useState(false);

    // Kích hoạt âm thanh sau tương tác người dùng đầu tiên
    useEffect(() => {
        const handleUserInteraction = () => {
            setCanPlayAudio(true);
            window.removeEventListener("click", handleUserInteraction);
        };
        window.addEventListener("click", handleUserInteraction);
        return () => window.removeEventListener("click", handleUserInteraction);
    }, []);

    useEffect(() => {
        if (!canPlayAudio || !voice || !audioRef.current) return;

        audioRef.current.play().catch((error) => {
            console.error("Error playing audio:", error);
        });

        const onEnded = () => onFinish();
        audioRef.current.addEventListener("ended", onEnded, { once: true });

        return () => {
            audioRef.current?.removeEventListener("ended", onEnded);
        };
    }, [canPlayAudio, voice, onFinish]);

    return <audio ref={audioRef} src={voice} preload="auto" />;
};
