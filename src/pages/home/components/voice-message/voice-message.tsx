import { useEffect, useRef } from "react";
import { VoiceMessageProps } from "./type";

export const VoiceMessage = ({ voice, onFinish = () => {}, ...props }: VoiceMessageProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const isDoneAudio = useRef<boolean>(false);
    const audioRetryIntervalId = useRef<NodeJS.Timeout>();

    useEffect(() => {
        isDoneAudio.current = false;
        if (audioRetryIntervalId.current) clearInterval(audioRetryIntervalId.current);

        audioRetryIntervalId.current = setInterval(() => {
            if (isDoneAudio.current) {
                clearInterval(audioRetryIntervalId.current);
                return;
            }

            audioRef.current
                ?.play()
                .then(() => {
                    isDoneAudio.current = true;
                })
                .catch((error) => {
                    console.error("Error playing audio:", error);
                });

            audioRef.current?.addEventListener(
                "ended",
                () => {
                    onFinish();
                },
                { once: true }
            );
        }, 1000);

        return () => clearInterval(audioRetryIntervalId.current);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voice, onFinish]);

    return <audio ref={audioRef} src={voice} />;
};
