import java.*; 
import java.io.*;
import java.util.Scanner;

public class routesScript{
	//Boolean function for checking if string is a number
    public static boolean isNumeric(String str){  
      try{  
        double d = Double.parseDouble(str);  
      }  
      catch(Exception e)  
      {  
        return false;  
      }  
      return true;  
    }
    
    
    
    public static void main(String[] args){
		//Read file and set filename for ouptut (answer)
        File csv = new File("routes-and-stops-DATA.csv");
        File answer = new File("route-and-their-stops.csv");
		
		String currentRoute = "";
		int count = 0;

    
        try{
            FileInputStream ff = new FileInputStream(csv);
            FileWriter writer = new FileWriter(answer);
			
            Scanner s = new Scanner(ff);
            //If two lines following each have the same route id, they are connected.
            while(s.hasNextLine()){
                String line = s.nextLine();
				String[] parts = line.split(",");
				
				
				
                if(parts[0].equalsIgnoreCase(currentRoute)){
                    writer.write("," + parts[1]);
                }else{
					currentRoute = parts[0];
					
					if(count > 0)
						writer.write("\n");
						
					writer.write(line);
				}
				
				count++;
                
            }
            
            writer.flush();
            writer.close();
            
        }catch(Exception e){
            System.out.println(e.toString());
        }
    }

}