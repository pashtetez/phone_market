package com.example.user.myapplication;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.format.DateUtils;
import android.view.KeyEvent;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.widget.Toast;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.StringBufferInputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;



import static com.example.user.myapplication.GetCacheDirExample.context;


public class MainActivity extends AppCompatActivity {

    static int clearCacheFolder(final File dir, final int numDays) {

        int deletedFiles = 0;
        if (dir!= null && dir.isDirectory()) {
            try {
                for (File child:dir.listFiles()) {

                    //first delete subdirectories recursively
                    if (child.isDirectory()) {
                        deletedFiles += clearCacheFolder(child, numDays);
                    }

                    //then delete the files and subdirectories in this dir
                    //only empty directories can be deleted, so subdirs have been done first
                    if (child.lastModified() < new Date().getTime() - numDays * DateUtils.DAY_IN_MILLIS) {
                        if (child.delete()) {
                            deletedFiles++;
                        }
                    }
                }
            }
            catch(Exception e) {
                Log.e("", String.format("Failed to clean the cache, error %s", e.getMessage()));
            }
        }
        return deletedFiles;
    }

    static String getJson( String a) {
        JSONObject r = new JSONObject();
        try {
//            String a = new String(cp1251String, "cp1251");
            //инициализация переменных и json
            String[] aArray = a.split("\r\n");
            JSONObject items = new JSONObject();
            JSONArray categories = new JSONArray();
            r.put("items", items);
            r.put("categories", categories);
            Boolean app = false;
            Boolean app1 = false;
            List<String> c = new ArrayList<String>();
            String left = "";

            //создание дополнительного массива
            for (int i = 0; i < aArray.length; i++) {
                if (!((aArray[i].endsWith(";")) || (aArray[i].endsWith(">")))) {
                    left = aArray[i];
                } else {
                    c.add(aArray[i] + left);
                    left = "";
                }
            }
            for (int i = 0; i < c.size(); i++) {
                if (c.get(i).startsWith("<Дата:")) {
                    r.put("date", c.get(i).substring(7, c.get(i).length() - 1));
                }
                if (c.get(i).startsWith("<Каталог>")) {
                    app = false;
                }
                if (app) {
                    String[] row = c.get(i).split(";", -1);
                    JSONObject group_code = new JSONObject();
                    group_code.put("group_code", row[0]);
                    group_code.put("group_name", row[1]);
                    group_code.put("parent_group_code", row[2]);

                    categories.put(group_code);
                }
                if (app1) {
                    String[] row = c.get(i).split(";", -1);
                    JSONObject code = new JSONObject();
                    code.put("code", row[0]);
                    code.put("name", row[1]);
                    code.put("parent_group_code", row[2]);
                    code.put("count_unit", row[3]);
                    code.put("count", row[4]);
                    code.put("weight", row[5]);
                    code.put("price1", row[6]);
                    code.put("price2", row[7]);
                    code.put("price3", row[8]);
                    code.put("currency_name", row[9]);
                    code.put("currency_course", row[10]);
                    JSONObject code1 = new JSONObject();
                    items.put(row[0], code);
                }
                if (c.get(i).startsWith("<КодТовара>")) {
                    app1 = true;
                }
                if (c.get(i).startsWith("<КодГруппы>")) {
                    app = true;
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        } finally {
          return r.toString();
        }
    }


    private class MyBrowser extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (url.startsWith("tel:") || url.startsWith("sms:") || url.startsWith("smsto:") || url.startsWith("mailto:") || url.startsWith("mms:") || url.startsWith("mmsto:") || url.startsWith("market:")) {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                startActivity(intent);
                return true;
            }
            else {
                view.loadUrl(url);
                return true;
            }
        }
    }
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU) {
            WebView myWebView = findViewById(R.id.webview);
            myWebView.loadUrl("javascript:menuButtonPressed()");
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        WebView myWebView = findViewById(R.id.webview);
        myWebView.loadUrl("javascript:backButtonPressed()");
//        if (myWebView.hasPopUp()) {
//            myWebView.loadUrl("javascript:closePopUp()");
//        } else {
//            super.onBackPressed();
//        }
    }
    WebViewLocalServer assetServer = null;
    String indexUrl = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        context = this;
        //int numDeletedFiles = clearCacheFolder(context.getCacheDir(), 0);
        assetServer = new WebViewLocalServer(context);
        WebViewLocalServer.AssetHostingDetails details = assetServer.hostAssets("");
        indexUrl = details.getHttpPrefix().buildUpon().appendPath("index.html").toString();
        //indexUrl = "http://192.168.1.5:8001/index.html";
        //indexUrl = "http://192.168.2.72:8001/index.html";

        setContentView(R.layout.activity_main);
        WebView myWebView = findViewById(R.id.webview);
        myWebView.setWebChromeClient(new WebChromeClient());

        Log.i("mymessage","mymessage");
        String textToCache = "b = \"wow1\";";

//        boolean success = GetCacheDirExample.writeAllCachedText( "myCacheFile.txt", textToCache);

        //https://stackoverflow.com/questions/44979340/html-link-to-local-file-in-webview-with-target-api-24
        myWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView webView, String url) {
                if (url.endsWith("my_live_loading_script.js")) {
                    Log.e("mymessage",url);
                    int index=url.lastIndexOf('/');
                    webView.loadUrl(url.substring(0,index)+"/swap1.txt");
                } else if (Uri.parse(url).getScheme().equals("file")) {
                    webView.loadUrl(url);
                } else {
                    // If the URI is not pointing to a local file, open with an ACTION_VIEW Intent
                    webView.getContext().startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                }
                return true; // in both cases we handle the link manually
            }
            @Override
            public WebResourceResponse shouldInterceptRequest (final WebView view, String url) {
                if (url.endsWith("my_live_loading_script.js")) {
                    Log.e("mymessage1",url);
                    return getCssWebResourceResponseFromString();
                } else {
                    Log.e("mymessage",url);
                    return assetServer.shouldInterceptRequest(url);
                }
            }

            private WebResourceResponse getCssWebResourceResponseFromString() {
                //String exampleString = "b = \"wow\";";

                try {
                    //URLConnection cn = new URL("http://192.168.1.5:8000/my_live_loading_script.js").openConnection();
                    Log.e("mymessage","hiu");
                    URL url = new URL("http://www.melt.com.ru/pdf/swap1.txt");
                    String exampleString = "";
                    HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                    try {
                        InputStream in = new BufferedInputStream(urlConnection.getInputStream());
                        BufferedReader br = new BufferedReader(new InputStreamReader(in,"cp1251"));
                        StringBuilder sb = new StringBuilder();
                        String line;
                        while ((line = br.readLine()) != null) {
                            sb.append(line+"\r\n");
                        }
                        exampleString = sb.toString();
                        exampleString = "data = " + getJson(exampleString);
                    } finally {
                        urlConnection.disconnect();
                    }
                    boolean success = GetCacheDirExample.writeAllCachedText( "myCacheFile.txt", exampleString);
                    InputStream stream = new ByteArrayInputStream(exampleString.getBytes(Charset.forName("UTF-8")));
                    return getUtf8EncodedCssWebResourceResponse(stream);
                } catch (IOException e) {
                    String exampleString = GetCacheDirExample.readAllCachedText( "myCacheFile.txt");
                    InputStream stream = new ByteArrayInputStream(exampleString.getBytes(Charset.forName("UTF-8")));
                    return getUtf8EncodedCssWebResourceResponse(stream);
                }


            }
            /**
             * Return WebResourceResponse with CSS markup from an asset (e.g. "assets/style.css").
             */
            private WebResourceResponse getCssWebResourceResponseFromAsset() {
                try {
                    return getUtf8EncodedCssWebResourceResponse(getAssets().open("style.css"));
                } catch (IOException e) {
                    return null;
                }
            }
            /**
             * Return WebResourceResponse with CSS markup from a raw resource (e.g. "raw/style.css").
             */
//            private WebResourceResponse getCssWebResourceResponseFromRawResource() {
//                return getUtf8EncodedCssWebResourceResponse(getResources().openRawResource(R.raw.style));
//            }
            private WebResourceResponse getUtf8EncodedCssWebResourceResponse(InputStream data) {
                return new WebResourceResponse("text/css", "UTF-8", data);
            }


        });

        myWebView.getSettings().setJavaScriptEnabled(true);

        myWebView.getSettings().setDomStorageEnabled(true);


        myWebView.getSettings().setDatabaseEnabled(true);
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
            myWebView.getSettings().setDatabasePath(getCacheDir().getPath());
        }


        myWebView.addJavascriptInterface(new WebAppInterface(this), "Android");
        myWebView.loadUrl(indexUrl);

    }

    public class WebAppInterface {
        Context mContext;

        /** Instantiate the interface and set the context */
        WebAppInterface(Context c) {
            mContext = c;
        }

        /** Show a toast from the web page */
        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public void exit() {
            Intent intent = new Intent(Intent.ACTION_MAIN);
            intent.addCategory(Intent.CATEGORY_HOME);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            finish();
            System.exit(0);
        }

    }
}
