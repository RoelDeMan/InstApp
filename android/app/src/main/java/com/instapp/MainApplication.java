package com.instapp;

import android.app.Application;

import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import net.no_mad.tts.TextToSpeechPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.reactlibrary.RNDefaultPreferencePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import net.no_mad.tts.TextToSpeechPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.reactlibrary.RNDefaultPreferencePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import net.no_mad.tts.TextToSpeechPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.reactlibrary.RNDefaultPreferencePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import net.no_mad.tts.TextToSpeechPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.reactlibrary.RNDefaultPreferencePackage;
import com.reactlibrary.RNDefaultPreferencePackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.RNFetchBlob.RNFetchBlobPackage;

import com.oblador.vectoricons.VectorIconsPackage;
import net.no_mad.tts.TextToSpeechPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.corbt.keepawake.KCKeepAwakePackage;


import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

import com.airbnb.android.react.maps.MapsPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage;

public class MainApplication extends Application implements ReactApplication {


  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }


    @Override
        protected List<ReactPackage> getPackages() {
          return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new KCKeepAwakePackage(),
                new RNDefaultPreferencePackage(),
                new RNGeocoderPackage(),
                new RNFetchBlobPackage(),
                new VectorIconsPackage(),
                new TextToSpeechPackage(),
                new MapsPackage(),
                new ReactNativeLocalizationPackage(),
                new PickerPackage(),
                new FIRMessagingPackage(),
                new FBSDKPackage(mCallbackManager),
              new SpeechReactPackage(),
              new RNSendIntentPackage(),
              new NavigationPackage(),
              new LocationServicesDialogBoxPackage()
          );
        }
    };


  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);
    // SoLoader.init(this, /* native exopackage */ false);
  }
}
