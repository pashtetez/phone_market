package ru.com.melt.meltlcd;

import android.support.v7.app.AppCompatActivity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.format.DateUtils;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceResponse;
import android.webkit.WebStorage;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import android.util.Log;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;
import static ru.com.melt.meltlcd.GetCacheDir.context;


public class WebBrowser extends AppCompatActivity {

    static int clearCacheFolder(final File dir, final int numDays) {
        int deletedFiles = 0;
        if (dir!= null && dir.isDirectory()) {
            try {
                for (File child:dir.listFiles()) {
                    if (child.isDirectory()) {
                        deletedFiles += clearCacheFolder(child, numDays);
                    }
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
            String[] aArray = a.split("\r\n");
            JSONObject items = new JSONObject();
            JSONArray categories = new JSONArray();
            r.put("items", items);
            r.put("categories", categories);
            Boolean app = false;
            Boolean app1 = false;
            List<String> c = new ArrayList<String>();
            String left = "";
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
        }

        return r.toString();
    }

    private class CustomBrowser extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView webView, String url) {
            if (Uri.parse(url).getScheme().equals("file")) {
                webView.loadUrl(url);
            } else {
                webView.getContext().startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
            }
            return true;
        }
        @Override
        public WebResourceResponse shouldInterceptRequest(final WebView view, String url) {
            Log.e("mymessage", "mymessage");
            if (url.endsWith("moscow_live_data.js")) {
                return getCssWebResourceResponseFromString("http://www.melt.com.ru/pdf/swap1.txt", "moscow_cached.txt");
            } else if (url.endsWith("piter_live_data.js")) {
                return getCssWebResourceResponseFromString("http://www.melt.com.ru/tmp/swap.txt", "piter_cached.txt");
            } else  {
                return assetServer.shouldInterceptRequest(url);
            }
        }
        private WebResourceResponse getCssWebResourceResponseFromString(String origin_uri, String cache_path) {
            try {
                URL url = new URL(origin_uri);
                Log.e("mymessage", "mymessage");
                String exampleString = "";
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                try {
                    InputStream in = new BufferedInputStream(urlConnection.getInputStream());
                    BufferedReader br = new BufferedReader(new InputStreamReader(in, "cp1251"));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) {
                        sb.append(line + "\r\n");
                    }
                    exampleString = sb.toString();
                    exampleString = "data = " + getJson(exampleString);

                    Log.e("mymessage", exampleString);
                } finally {
                    urlConnection.disconnect();
                }
                boolean success = GetCacheDir.writeAllCachedText(cache_path, exampleString);
                InputStream stream = new ByteArrayInputStream(exampleString.getBytes(Charset.forName("UTF-8")));
                return new WebResourceResponse("text/css", "UTF-8", stream);
            } catch (IOException e) {
                String exampleString = GetCacheDir.readAllCachedText(cache_path);
                InputStream stream = new ByteArrayInputStream(exampleString.getBytes(Charset.forName("UTF-8")));
                return new WebResourceResponse("text/css", "UTF-8", stream);
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
        public void clearData() {
            clearCacheFolder(mContext.getCacheDir(),0);
            WebStorage.getInstance().deleteAllData();
            exit();
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

    WebViewLocalServer assetServer = null;
    String indexUrl = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        context = this;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) { //prettify app if API allows
            Window window = this.getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.setStatusBarColor(Color.parseColor("#009900"));//High api level
        }
        assetServer = new WebViewLocalServer(context);
        WebViewLocalServer.AssetHostingDetails details = assetServer.hostAssets("");
        indexUrl = details.getHttpPrefix().buildUpon().appendPath("index.html").toString();
        setContentView(R.layout.activity_web_browser);
        WebView myWebView = findViewById(R.id.webview);
        myWebView.setWebChromeClient(new WebChromeClient());
        myWebView.setWebViewClient(new CustomBrowser());
        myWebView.getSettings().setJavaScriptEnabled(true);
        myWebView.getSettings().setDomStorageEnabled(true);
        myWebView.getSettings().setDatabaseEnabled(true);
        myWebView.addJavascriptInterface(new WebAppInterface(this), "Android");
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
            myWebView.getSettings().setDatabasePath(getCacheDir().getPath());
        }
        myWebView.loadUrl(indexUrl);
    }
}
