package io.ionic.starter;

import com.getcapacitor.BridgeActivity;
import ee.forgr.biometric.NativeBiometric;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    bridgeBuilder.addPlugin(NativeBiometric.class);
  }
}
