package com.instapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;

import org.json.JSONArray;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by BaileyDesktop on 29-6-2017.
 */

public class SpeechRecognizerModule extends ReactContextBaseJavaModule {

    public final static String NAME = "SpeechModule";

    private SpeechRecognizer speechRecognizer;
    private Intent speechRecognizerIntent;
    private Promise promise;


    public SpeechRecognizerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                speechRecognizer = SpeechRecognizer.createSpeechRecognizer(getReactApplicationContext());
                setupRecognitionListener();
                setupSpeechRecognizerIntent();
            }
        });



    }

    private void setupRecognitionListener() {
        speechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle params) {
            }

            @Override
            public void onBeginningOfSpeech() {
            }

            @Override
            public void onRmsChanged(float rmsdB) {
            }

            @Override
            public void onBufferReceived(byte[] buffer) {
            }

            @Override
            public void onEndOfSpeech() {
            }

            @Override
            public void onError(int error) {
            }

            @Override
            public void onResults(Bundle results) {
                ArrayList<String> result = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                promise.resolve(new JSONArray(result).toString());
            }

            @Override
            public void onPartialResults(Bundle partialResults) {
            }

            @Override
            public void onEvent(int eventType, Bundle params) {
            }

        });
    }

    private void setupSpeechRecognizerIntent() {
        speechRecognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        speechRecognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        speechRecognizerIntent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE,
                getReactApplicationContext().getPackageName());
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void doSomething(String text) {
        Toast.makeText(getReactApplicationContext(), text, Toast.LENGTH_LONG).show();
    }

    @ReactMethod
    public void startListening(Promise promise) {
        this.promise = promise;
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                speechRecognizer.startListening(speechRecognizerIntent);
            }
        });
    }

    @ReactMethod
    public void changeLanguage(String language){
        speechRecognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE,language);
        speechRecognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,language);
    }
}
