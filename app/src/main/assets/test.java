import org.json.simple.JSONArray;
import org.json.simple.JSONObject;


import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class test {

    public static void main(String[] args) throws Exception {

        byte[] cp1251String = Files.readAllBytes(Paths.get("/home/alena/IdeaProjects/test/src/main/java/swap1.txt"));
        String a= new String(cp1251String,"cp1251");
        //инициализация переменных и json
        String[] aArray=a.split("\r\n");
        System.out.println(aArray.length);
        JSONArray items = new JSONArray();
        JSONArray categories = new JSONArray();
        JSONObject r = new JSONObject();
        r.put("items",items);
        r.put("categories",categories);
        Boolean app=false;
        Boolean app1=false;
        List<String> c = new ArrayList<String>();
        String left = "";

        //создание дополнительного массива
        for (int i=0;i<aArray.length;i++){
            if(!((aArray[i].endsWith(";")) || (aArray[i].endsWith(">")))) {
                left=aArray[i];
            }
            else {
                c.add(aArray[i]+left);
                left="";
            }
        }

        for (int i=0; i<c.size(); i++){
            System.out.println(i);
            if(c.get(i).startsWith("<Дата:")){
                r.put("date", c.get(i).substring(7,c.get(i).length()-1));
            }
            if(c.get(i).startsWith("<Каталог>")){
                app=false;
            }
            if (app){
                String[] row=c.get(i).split(";",-1);
                JSONObject group_code = new JSONObject();
                group_code.put("group_code",row[0]);
                group_code.put("group_name",row[1]);
                group_code.put("parent_group_code",row[2]);

                categories.add(group_code);
            }
            if (app1){
                String[] row=c.get(i).split(";",-1);
                JSONObject code = new JSONObject();
                code.put("code",row[0]);
                code.put("name",row[1]);
                code.put("parent_group_code",row[2]);
                code.put("count_unit",row[3]);
                code.put("count",row[4]);
                code.put("weight",row[5]);
                code.put("price1",row[6]);
                code.put("price2",row[7]);
                code.put("price3",row[8]);
                code.put("currency_name",row[9]);
                code.put("currency_course",row[10]);

                items.add(code);
            }
            if (c.get(i).startsWith("<КодТовара>")){
                app1=true;
            }
            if (c.get(i).startsWith("<КодГруппы>")){
                app=true;
            }
        }

    System.out.println(r.toString());
    }
}
