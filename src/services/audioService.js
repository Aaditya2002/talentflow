import Groq from "groq-sdk";

class AudioService {
    constructor() {
        if (AudioService.instance) {
            return AudioService.instance;
        }
        
        console.log('Environment variables:', {
            GROQ_KEY: process.env.REACT_APP_GROQ_API_KEY,
            ALL_ENV: process.env
        });

        this.groq = new Groq({
            apiKey: process.env.REACT_APP_GROQ_API_KEY || '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',
            dangerouslyAllowBrowser: true
        });
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.silenceTimer = null;
        this.SILENCE_THRESHOLD = 2000; // 2 seconds of silence
        this.stream = null;
        this.audioContext = null;

        AudioService.instance = this;
    }

    static getInstance() {
        if (!AudioService.instance) {
            AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }

    async startRecording(onTranscriptionComplete) {
        console.log('Starting recording...');
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Stop any existing tracks
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.stopRecording();
            }

            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];
            this.isRecording = true;

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                    console.log('Audio chunk received:', event.data.size, 'bytes');
                }
            };

            this.mediaRecorder.onstart = () => {
                console.log('Recording started successfully');
                this.startSilenceDetection(this.stream, onTranscriptionComplete);
            };

            this.mediaRecorder.onstop = async () => {
                console.log('Recording stopped, processing audio...');
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                console.log('Audio blob created:', audioBlob.size, 'bytes');
                await this.transcribeAudio(audioBlob, onTranscriptionComplete);
                this.audioChunks = [];
                
                // Clean up the stream
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            };

            this.mediaRecorder.start(100);
        } catch (error) {
            console.error('Error starting recording:', error);
            onTranscriptionComplete('Error: Could not start recording');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            if (this.silenceTimer) {
                clearTimeout(this.silenceTimer);
            }
            
            // Clean up audio context if it exists
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }
        }
    }

    startSilenceDetection(stream, onTranscriptionComplete) {
        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        audioSource.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const checkSilence = () => {
            if (!this.isRecording) return;

            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / bufferLength;

            if (average < 10) { // Silence threshold
                if (!this.silenceTimer) {
                    this.silenceTimer = setTimeout(() => {
                        if (this.isRecording) {
                            this.stopRecording();
                        }
                    }, this.SILENCE_THRESHOLD);
                }
            } else {
                if (this.silenceTimer) {
                    clearTimeout(this.silenceTimer);
                    this.silenceTimer = null;
                }
            }

            requestAnimationFrame(checkSilence);
        };

        checkSilence();
    }

    async transcribeAudio(audioBlob, onTranscriptionComplete) {
        try {
            console.log('Starting transcription...');
            const file = new File([audioBlob], "recording.wav", {
                type: "audio/wav"
            });
            console.log('File created for transcription:', file.size, 'bytes');

            const transcription = await this.groq.audio.transcriptions.create({
                file: file,
                model: "whisper-large-v3-turbo",
                response_format: "verbose_json",
            });

            console.log('Transcription received:', transcription);
            console.log('Transcribed text:', transcription.text);
            onTranscriptionComplete(transcription.text);
        } catch (error) {
            console.error('Transcription error details:', error);
            onTranscriptionComplete('Error transcribing audio');
        }
    }
}

// Export the class itself
export default AudioService; 