import TTS from 'react-native-tts';

class TTSService{

    addEventListener(event,listener){
        TTS.addEventListener(event,listener);
    }

    removeEventListener(event, listener){
        TTS.removeEventListener(event,listener);
    }

    setDucking(value){
        TTS.setDucking(value)
    }

    speak(message){
        TTS.speak(message);
    }

    stop(){
        TTS.stop();
    }

}

export default new TTSService();
