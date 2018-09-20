package com.instapp;

import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by baile on 28-7-2017.
 */
public class NavigationModule extends ReactContextBaseJavaModule {

    public static final String NAME = "NavigationModule";

    public NavigationModule(ReactApplicationContext reactContext){
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void startNavigation(String latitude, String longitude){
        Uri gmmIntentUri = Uri.parse("google.navigation:q="+latitude+","+longitude);
        Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
        mapIntent.setPackage("com.google.android.apps.maps");
        mapIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(mapIntent);
    }

    @ReactMethod
        public void startAddressNavigation(String street, String city){
            Uri gmmIntentUri = Uri.parse("google.navigation:q="+street+"+"+city);
            Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
            mapIntent.setPackage("com.google.android.apps.maps");
            mapIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getReactApplicationContext().startActivity(mapIntent);
        }
}
