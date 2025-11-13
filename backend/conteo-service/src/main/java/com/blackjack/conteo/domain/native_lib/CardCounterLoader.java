package com.blackjack.conteo.domain.native_lib;

import com.sun.jna.Native;
import com.sun.jna.Platform;

/**
 * Helper to lazily load the native CardCounter library via JNA.
 *
 * Behavior:
 * - Reads optional system property `card.counter.lib.name` to override the library base name.
 * - Falls back to platform defaults: `card_counter` on Windows, `libcard_counter` elsewhere.
 * - Throws UnsatisfiedLinkError if the native library cannot be found; message includes guidance.
 */
public final class CardCounterLoader {

    private static volatile CardCounterLibrary instance;

    private CardCounterLoader() {}

    public static CardCounterLibrary get() {
        if (instance == null) {
            synchronized (CardCounterLoader.class) {
                if (instance == null) {
                    String configuredName = System.getProperty("card.counter.lib.name");
                    String configuredPath = System.getProperty("card.counter.lib.path");

                    // If a full path is provided, try to load that directly. This is useful when
                    // running on Linux with a .so file (or when you want to provide an absolute path).
                    String chosen = null;
                    try {
                        if (configuredPath != null && !configuredPath.isBlank()) {
                            chosen = configuredPath;
                            instance = Native.load(configuredPath, CardCounterLibrary.class);
                        } else {
                            String libName = (configuredName == null || configuredName.isBlank())
                                ? "card_counter" // JNA añadirá el prefijo 'lib' y la extensión en Linux automáticamente
                                : configuredName;
                            chosen = libName;

                            instance = Native.load(libName, CardCounterLibrary.class);
                        }
                    } catch (UnsatisfiedLinkError e) {
                        // Provide an explanatory message to help developers fix deployment
                        StringBuilder sb = new StringBuilder();
                        sb.append("Unable to load native library '").append(chosen == null ? "(unknown)" : chosen).append("'. ");
                        sb.append("Possible fixes:\n");
                        sb.append(" - Ensure the native library file (e.g. ")
                          .append(Platform.isWindows() ? "card_counter.dll" : "libcard_counter.so")
                          .append(" ) is available and matches the JVM bitness (x86 vs x64).\n");
                                                sb.append(" - Add the folder containing the native library to the PATH (Windows) or LD_LIBRARY_PATH (Linux).\n");
                                                sb.append(" - Or set system property -Djna.library.path=PATH_TO_DIR when launching the JVM.\n");
                                                sb.append(" - Or set system property -Dcard.counter.lib.path=/absolute/path/libcard_counter.so to force loading a specific file.\n");
                                                sb.append(" - For development, place the native file under src/main/resources/")
                                                    .append(Platform.isWindows() ? "win32-x86-64/" : "linux-x86-64/")
                                                    .append(" so it is copied to classpath and JNA can extract it.\n");
                        sb.append("Original error: ").append(e.getMessage());

                        UnsatisfiedLinkError wrapped = new UnsatisfiedLinkError(sb.toString());
                        wrapped.initCause(e);
                        throw wrapped;
                    }
                }
            }
        }
        return instance;
    }
}
